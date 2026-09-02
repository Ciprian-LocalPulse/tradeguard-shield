# SSRF Controls

The API receives arbitrary URLs through `/api/v1/check`. This creates SSRF risk if the system performs unrestricted outbound requests.

## Implemented Controls

- Reject non-HTTP protocols.
- Reject `localhost`, loopback hosts, and direct IPv4 addresses.
- Reject internal-style TLDs such as `.local` and `.internal`.
- Normalize and validate URLs before check orchestration.
- Do not fetch arbitrary page content in the MVP.

## Production Requirements

- Resolve DNS and block private IP ranges after resolution.
- Re-check DNS at connection time.
- Use egress allowlists or proxy isolation for provider calls.
- Apply per-provider timeouts and response size limits.
- Log only redacted request metadata.
