import type { CheckResponse, DomainSignals, UserReport } from "@tradeguard/shared";
import type { AuditEvent, PersistencePort } from "../ports/persistence.js";

export class PostgresPersistenceAdapter implements PersistencePort {
  constructor(private readonly databaseUrl: string) {}

  async saveCheck(_response: CheckResponse, _signals: DomainSignals): Promise<void> {
    void this.databaseUrl;
    throw new Error("PostgreSQL adapter requires a database client implementation before production use.");
  }

  async saveReport(_report: UserReport): Promise<{ id: string; createdAt: string; status: "new" | "reviewing" | "closed"; }> {
  void this.databaseUrl;
  throw new Error("PostgreSQL adapter requires a database client implementation before production use.");
}

  async saveAuditEvent(_event: AuditEvent): Promise<void> {
    void this.databaseUrl;
    throw new Error("PostgreSQL adapter requires a database client implementation before production use.");
  }

  async countReports(): Promise<number> {
    void this.databaseUrl;
    throw new Error("PostgreSQL adapter requires a database client implementation before production use.");
  }
}
