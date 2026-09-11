import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type Stats = { checks24h: number; reports24h: number; highRiskDomains: number };
type Domain = { domain: string; score: number; riskLevel: string; checkedAt: string };

function App() {
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");
  const [stats, setStats] = useState<Stats>({ checks24h: 0, reports24h: 0, highRiskDomains: 0 });
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
    const headers: HeadersInit = {};
    const dashboardApiKey = import.meta.env.VITE_DASHBOARD_API_KEY;
    if (dashboardApiKey) headers.authorization = `Bearer ${dashboardApiKey}`;

    Promise.all([
      fetch(`${apiBaseUrl}/api/v1/health/ready`),
      fetch(`${apiBaseUrl}/api/v1/stats`, { headers }),
      fetch(`${apiBaseUrl}/api/v1/domains`, { headers })
    ])
      .then(async ([health, statsResponse, domainsResponse]) => {
        if (!health.ok || !statsResponse.ok || !domainsResponse.ok) throw new Error("Dashboard API request failed");
        setStats((await statsResponse.json()) as Stats);
        setDomains(((await domainsResponse.json()) as { domains: Domain[] }).domains);
        setStatus("online");
      })
      .catch(() => setStatus("offline"));
  }, []);

  const metrics = [
    { label: "Checks in 24h", value: stats.checks24h },
    { label: "High-risk domains", value: stats.highRiskDomains },
    { label: "User reports", value: stats.reports24h }
  ];

  return (
    <main>
      <header>
        <h1>TradeGuard Shield</h1>
        <p>Operational dashboard for trading-site risk intelligence.</p>
        <span className={`status ${status}`}>API {status}</span>
      </header>
      <section className="metrics">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>
      <section>
        <h2>Review Queue</h2>
        <table>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Risk</th>
              <th>Evidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={`${domain.domain}-${domain.checkedAt}`}>
                <td>{domain.domain}</td>
                <td>{domain.riskLevel}</td>
                <td>Score {domain.score}</td>
                <td>{new Date(domain.checkedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {domains.length === 0 && <p className="empty-note">No checked domains are available yet.</p>}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
