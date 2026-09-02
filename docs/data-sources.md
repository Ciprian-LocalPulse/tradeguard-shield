# Data Sources

This repository includes mock adapters so local development does not depend on external credentials. Production adapters should be added behind the same signal interfaces.

## Priority Sources

- RDAP for domain age, registrar, nameserver, and privacy metadata.
- Certificate Transparency for certificate freshness and issuer history.
- Regulator registries: FCA, SEC, CySEC, ASIC, ESMA, FINRA where applicable.
- Threat feeds: Google Safe Browsing, PhishTank, OpenPhish, and curated local lists.
- Page-content analysis for unrealistic return promises, impersonation language, and aggressive deposit funnels.

## Evidence Rules

Every negative score impact should have a source, a reason code, and a human-readable explanation.
