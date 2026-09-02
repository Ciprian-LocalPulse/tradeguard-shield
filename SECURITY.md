# Security Policy

TradeGuard Shield is security-sensitive software. It accepts URLs, produces risk intelligence, and may eventually process user reports and evidence. Security reports are welcome and should be handled carefully.

## Supported Versions

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |

## Reporting A Vulnerability

Do not open a public issue for vulnerabilities.

Contact: `contact@agentflow-enterprise.com`

Please include:

- Affected component
- Reproduction steps
- Impact
- Suggested remediation if known
- Whether disclosure deadlines apply

## Disclosure Process

The maintainer will triage reports, confirm impact where possible, prepare a fix, and coordinate disclosure. Public disclosure should wait until users have a reasonable opportunity to update.

## Secret Handling

Never commit:

- API keys
- passwords
- authentication tokens
- private keys
- seed phrases
- banking credentials
- `.env` files

Use environment variables and managed secret stores in production.

## SSRF And URL Handling

The API accepts arbitrary URLs for risk checks. It must never become an unrestricted server-side request proxy. Current safeguards reject local hosts, private-style hostnames, direct IP addresses, and non-HTTP protocols before a check is processed.

## Browser Extension Security

The extension should keep permissions minimal, avoid inline scripts, avoid storing secrets, handle offline/API failure states, and never inject untrusted HTML into visited pages.

## Data Retention

The MVP uses memory adapters. Production deployments must define retention windows for reports, feedback, audit events, and evidence snapshots before collecting real user data.

## Dependency Policy

Dependencies are reviewed through GitHub dependency review, pnpm audit, lockfile integrity, and CodeQL where available.
