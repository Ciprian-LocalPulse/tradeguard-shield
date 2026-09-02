# Dependency Policy

TradeGuard Shield uses a pnpm lockfile and GitHub security workflows.

## Controls

- `pnpm audit --audit-level moderate`
- GitHub Dependency Review on pull requests
- Dependabot weekly updates
- CodeQL analysis for JavaScript and TypeScript
- Lockfile committed to source control

## Rules

- Do not add dependencies without a clear reason.
- Prefer maintained packages with active security response.
- Avoid packages that run unnecessary install scripts.
- Document any high-risk dependency.
