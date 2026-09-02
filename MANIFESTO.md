# TradeGuard Shield Manifesto

TradeGuard Shield exists to make trading-site risk visible before people are pressured into deposits, crypto transfers, account verification traps, or fake broker funnels.

The internet made it easy to launch a financial-looking website in minutes. That speed is useful for legitimate businesses, but it also gives scammers an unfair advantage over ordinary users. A user should not need to be a cybersecurity analyst, regulator, OSINT researcher, and web engineer just to decide whether a trading website deserves trust.

TradeGuard Shield turns public signals into explainable risk intelligence.

## Principles

### 1. Evidence Before Accusation

The project does not casually label a website as fraud. It scores observable risk signals: domain age, threat-feed matches, regulator evidence, TLS state, suspicious marketing claims, review patterns, and community reports.

### 2. Explainability Over Mystery

A score without reasons is not enough. Every negative signal must have a source, a reason code, and a user-readable explanation.

### 3. Security By Default

The API, extension, and infrastructure should assume abuse is possible and include validation, rate limits, redaction, and safe defaults.

### 4. Privacy By Design

The project should collect the minimum data required to provide risk intelligence and should avoid sensitive trading, identity, and wallet data.

### 5. Minimal Permissions

The browser extension should request only the permissions required to inspect the current web context and display a verdict.

### 6. Transparent Scoring

Thresholds, weights, reason codes, and limitations should be documented and testable.

### 7. Reproducible Builds

Builds should be deterministic, automated, and documented so users and maintainers can inspect what is shipped.

### 8. Defensive Engineering

Failures from upstream data providers should become unavailable signals, not unsupported accusations.

### 9. Responsible Disclosure

Security reports should be handled privately first, with coordinated disclosure after mitigation.

### 10. No Guaranteed Safety Claims

Low risk does not mean safe. TradeGuard Shield provides evidence-backed risk intelligence, not certainty.

### 11. Data Provenance

Every meaningful signal should preserve source, timestamp, and evidence metadata.

### 12. Auditability

Scoring, data ingestion, and operational changes should leave enough traceability for maintainers to review decisions.

### 13. User Protection Without Unnecessary Surveillance

The product should help users avoid harm without building invasive browsing profiles.

### 14. Open Engineering Standards

Interfaces, schemas, workflows, and documentation should be understandable to outside contributors.

### 15. Production Reliability

The system should degrade gracefully when providers, caches, or databases are unavailable.

## Product Principle

### Consumer Protection First

The primary user is the person about to trust a trading website with money, identity documents, or wallet access. The product should reduce panic, confusion, and manipulation.

### Legitimate Businesses Need Recourse

Risk intelligence must support appeal, correction, and evidence review. False positives should be treated as product failures, not acceptable collateral damage.

### Open Interfaces, Replaceable Providers

The architecture is designed so threat feeds, regulator registries, RDAP providers, review sources, and scoring models can evolve without rewriting the product.

### Independent Development

TradeGuard Shield is authored by Ciprian Ștefan Pleșca as independent software for real-time trading-site risk intelligence.

## What Success Looks Like

- Users see risk before they deposit money.
- Engineers can audit how a score was produced.
- Regulators, researchers, and maintainers can add evidence sources.
- Legitimate platforms can contest bad data.
- The system remains useful even before machine learning is introduced.

TradeGuard Shield is not a court, regulator, broker, investment adviser, or financial guarantee. It is a protective intelligence layer for a web where financial deception moves faster than manual verification.
