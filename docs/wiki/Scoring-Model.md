# Scoring Model

TradeGuard Shield starts with an explainable rule-based model. Machine learning can be added later once labeled datasets and review workflows exist.

## Thresholds

```mermaid
flowchart LR
  A["0-30 High Risk"] --> Red[Red Badge]
  B["31-60 Medium Risk"] --> Yellow[Yellow Badge]
  C["61-100 Low Risk"] --> Green[Green Badge]
```

## Signal Weighting

```mermaid
pie title Current Risk Penalty Categories
  "Threat-feed match" : 55
  "Very young domain" : 30
  "No regulator match" : 20
  "Invalid TLS" : 18
  "Suspicious claims" : 20
  "Negative reviews" : 12
  "Social spike" : 10
  "WHOIS privacy" : 8
```

## Explainability Contract

Every scoring reason must include:

- `code`
- `severity`
- `detail`
- `source`
- optional `evidenceUrl`

## Future Model Evolution

```mermaid
flowchart TD
  Rules[Transparent Rules] --> Dataset[Labeled Dataset]
  Dataset --> Calibration[Threshold Calibration]
  Calibration --> ML[Optional ML Classifier]
  ML --> Audit[Independent Methodology Audit]
```
