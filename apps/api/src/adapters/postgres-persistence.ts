import type { CheckResponse, DomainSignals, UserReport } from "@tradeguard/shared";
import { Pool } from "pg";
import type {
  AuditEvent,
  DashboardStats,
  DomainFeedback,
  DomainSummary,
  PersistencePort
} from "../ports/persistence.js";

export class PostgresPersistenceAdapter implements PersistencePort {
  private readonly pool: Pool;

  constructor(
    databaseUrl: string,
    pool = new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 30000,
      max: 10,
      query_timeout: 3000
    })
  ) {
    this.pool = pool;
  }

  async saveCheck(response: CheckResponse, signals: DomainSignals): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO domains (id, domain, first_seen_at, last_checked_at)
         VALUES ($1, $2, $3, $3)
         ON CONFLICT (domain) DO UPDATE SET last_checked_at = EXCLUDED.last_checked_at`,
        [crypto.randomUUID(), response.domain, response.checkedAt]
      );

      const domainResult = await client.query<{ id: string }>("SELECT id FROM domains WHERE domain = $1", [
        response.domain
      ]);
      const domainId = domainResult.rows[0]?.id;
      if (!domainId) throw new Error("PostgreSQL domain upsert did not return an id");

      const checkId = crypto.randomUUID();
      await client.query(
        `INSERT INTO checks (id, domain_id, score, risk_level, badge, checked_at, cache_ttl_seconds)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          checkId,
          domainId,
          response.score,
          response.riskLevel,
          response.badge,
          response.checkedAt,
          response.cacheTtlSeconds
        ]
      );

      for (const reason of response.reasons) {
        await client.query(
          `INSERT INTO signals (id, check_id, source, code, severity, detail, evidence_url, observed_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            crypto.randomUUID(),
            checkId,
            reason.source,
            reason.code,
            reason.severity,
            reason.detail,
            reason.evidenceUrl ?? null,
            reason.observedAt ?? response.checkedAt
          ]
        );
      }

      await client.query("COMMIT");
      void signals;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  async saveReport(
    report: UserReport
  ): Promise<{ id: string; createdAt: string; status: "new" | "reviewing" | "closed" }> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await this.pool.query(
      `INSERT INTO reports (id, url, reason, contact_email, status, created_at)
       VALUES ($1, $2, $3, $4, 'new', $5)`,
      [id, report.url, report.reason, report.contactEmail ?? null, createdAt]
    );
    return { id, createdAt, status: "new" };
  }

  async saveFeedback(feedback: DomainFeedback): Promise<{ id: string; createdAt: string }> {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await this.pool.query(
      `INSERT INTO feedback (id, domain, accurate, note, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, feedback.domain, feedback.accurate, feedback.note ?? null, createdAt]
    );
    return { id, createdAt };
  }

  async saveAuditEvent(event: AuditEvent): Promise<void> {
    await this.pool.query(
      `INSERT INTO audit_events (id, action, subject, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [crypto.randomUUID(), event.action, event.subject, event.metadata ?? {}, event.createdAt]
    );
  }

  async countReports(): Promise<number> {
    const result = await this.pool.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM reports");
    return Number(result.rows[0]?.count ?? 0);
  }

  async getStats(): Promise<DashboardStats> {
    const result = await this.pool.query<{ checks24h: string; reports24h: string; highRiskDomains: string }>(`
      SELECT
        (SELECT COUNT(*) FROM checks WHERE checked_at >= NOW() - INTERVAL '24 hours')::text AS "checks24h",
        (SELECT COUNT(*) FROM reports WHERE created_at >= NOW() - INTERVAL '24 hours')::text AS "reports24h",
        (SELECT COUNT(DISTINCT d.domain) FROM checks c JOIN domains d ON d.id = c.domain_id
         WHERE c.risk_level = 'high' AND c.checked_at >= NOW() - INTERVAL '24 hours')::text AS "highRiskDomains"
    `);
    const row = result.rows[0];
    return {
      checks24h: Number(row?.checks24h ?? 0),
      reports24h: Number(row?.reports24h ?? 0),
      highRiskDomains: Number(row?.highRiskDomains ?? 0)
    };
  }

  async searchDomains(query: string): Promise<DomainSummary[]> {
    const result = await this.pool.query<DomainSummary>(
      `SELECT d.domain, c.score, c.risk_level AS "riskLevel", c.checked_at AS "checkedAt"
       FROM checks c JOIN domains d ON d.id = c.domain_id
       WHERE d.domain ILIKE $1
       ORDER BY c.checked_at DESC
       LIMIT 50`,
      [`%${query.trim()}%`]
    );
    return result.rows;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
