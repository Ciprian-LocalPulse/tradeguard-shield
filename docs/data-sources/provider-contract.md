# Provider Contract

Signal providers must return evidence without turning missing data into accusations.

## Provider Result Rules

- Include source identifier.
- Include domain.
- Include observed timestamp.
- Mark unavailable data as unavailable.
- Preserve evidence URLs when available.
- Use stable reason codes.
- Apply timeout and retry policy.

## Failure Rule

Unavailable upstream data must not be treated as proof of fraud.
