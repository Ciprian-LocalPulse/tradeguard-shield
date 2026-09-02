# Data Sources

The MVP uses deterministic mock adapters so the project is runnable without external credentials. Production deployments should replace those adapters with real integrations.

## Source Categories

```mermaid
mindmap
  root((TradeGuard Signals))
    Domain
      RDAP
      WHOIS
      Registrar
      Domain age
    Security
      TLS
      Certificate Transparency
      Safe Browsing
      Phishing feeds
    Regulation
      FCA
      SEC
      CySEC
      ASIC
      ESMA
      FINRA
    Reputation
      Reviews
      User reports
      Social mentions
    Content
      Guaranteed profit claims
      Deposit pressure
      Impersonation language
```

## Evidence Quality

High-impact penalties should prefer official or reproducible sources. Community reports and reviews should influence prioritization but require careful weighting.
