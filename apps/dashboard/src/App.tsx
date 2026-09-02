import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const metrics = [
  { label: "Checks today", value: "0" },
  { label: "High-risk domains", value: "0" },
  { label: "User reports", value: "0" }
];

function App() {
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL ?? "http://localhost:8080";
    fetch(`${apiBaseUrl}/api/v1/health/ready`)
      .then((response) => setStatus(response.ok ? "online" : "offline"))
      .catch(() => setStatus("offline"));
  }, []);

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
            <tr>
              <td>fake-broker.test</td>
              <td>High</td>
              <td>Threat feed, young domain, no license match</td>
              <td>New</td>
            </tr>
          </tbody>
        </table>
        <p className="empty-note">This dashboard is ready for authenticated production data once persistence is enabled.</p>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
