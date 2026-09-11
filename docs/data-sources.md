# Data-Source Methodology

## Scope

TradeGuard Shield uses public or openly documented observations to support a risk indicator. A source can support a finding, but no source is treated as a complete ground truth about an organisation.

| Provider | Observation | Runtime policy | Coverage limitation |
|---|---|---|---|
| RDAP through `https://rdap.org/domain/{domain}` | Registration event and privacy-proxy indicators | 3-second timeout; neutral on error | TLD registries expose different fields and historical depth |
| OpenPhish `https://openphish.com/feed.txt` | URL/domain presence in a public phishing feed | Local fetch cache, maximum one request per 15 minutes | Public-feed scope, freshness, and false-positive characteristics are external |
| Google Safe Browsing v4 | Threat match response | Optional; API key from `GOOGLE_SAFE_BROWSING_API_KEY`; bounded request | Google quota, terms, regional and classifier coverage apply |
| TLS endpoint | HTTPS reachability and certificate authorisation | 3-second bounded request | Vantage point, DNS, routing, and transient outages affect results |
| Content analysis | Page-language and claim indicators | Bounded page request and parser | Language, rendering, and obfuscation reduce recall |
| FCA Warning List RSS | FCA-published warning-domain entries | 3-second timeout; local cache for 15 minutes | UK-focused warning feed; not a complete authorisation register or global database |

## Evidence rules

Every adverse score contribution must have a stable reason code, source family, and human-readable explanation. Unknown data must not be replaced by a made-up value. Feed errors therefore return neutral evidence and should be observable through logs and metrics.

## Threat matching

OpenPhish is fetched lazily and cached for 15 minutes. Matching is performed against the normalised domain/URL representation; the feed is never downloaded for every user request. Google Safe Browsing is an optional quota-governed service, so deployments must treat the key as a secret and monitor quota failures.

## Interpretation limits

Absence from a feed is not evidence of legitimacy. RDAP privacy-proxy detection is heuristic and may be incomplete. FCA warning-list presence is a regulator-published warning signal, not a universal legal finding; absence does not establish authorisation. Regulator coverage is geographically and institutionally limited. The score is a triage instrument whose validity must be established on a labelled evaluation set before it is used for consequential decisions.
