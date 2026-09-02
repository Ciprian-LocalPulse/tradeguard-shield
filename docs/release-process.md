# Release Process

TradeGuard Shield uses Semantic Versioning.

## Release Checklist

1. Update `CHANGELOG.md`.
2. Run `pnpm lint`.
3. Run `pnpm typecheck`.
4. Run `pnpm test`.
5. Run `pnpm build`.
6. Run `pnpm audit --audit-level moderate`.
7. Package the extension using the extension build workflow.
8. Create a GitHub release through the manual release workflow.

## Rollback

Rollback should prefer redeploying the last known-good container image or release artifact. Do not rewrite public Git history.
