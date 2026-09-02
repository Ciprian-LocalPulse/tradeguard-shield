# System Overview

TradeGuard Shield combines browser-side awareness with server-side intelligence.

## Product Components

```mermaid
flowchart TB
  subgraph Client
    Extension[Manifest V3 Extension]
    Popup[Risk Popup]
    Banner[High-Risk Banner]
  end

  subgraph Platform
    API[Fastify API]
    Shared[Shared Scoring Package]
    Dashboard[Analyst Dashboard]
  end

  subgraph Intelligence
    RDAP[RDAP and WHOIS]
    TLS[TLS and Certificate Transparency]
    Feeds[Threat Feeds]
    Registries[Financial Registries]
    Content[Content Analysis]
  end

  Extension --> API
  Popup --> Extension
  API --> Shared
  API --> RDAP
  API --> TLS
  API --> Feeds
  API --> Registries
  API --> Content
  Dashboard --> API
```

## Core Outcome

The user receives a simple result:

- Risk score from 0 to 100
- Risk level: low, medium, or high
- Badge: green, yellow, or red
- Evidence-backed reasons
- Timestamp and cache lifetime
