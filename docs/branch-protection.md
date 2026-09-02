# Recommended Branch Protection

The GitHub connector available in this environment can write repository files, but it does not expose a branch-protection write operation. Use the settings below in GitHub to protect `main` without blocking Ciprian Ștefan Pleșca as repository owner.

## Recommended Rule

Branch name pattern: `main`

Enable:

- Require a pull request before merging
- Dismiss stale pull request approvals when new commits are pushed
- Require conversation resolution before merging
- Prevent force pushes
- Prevent deletions

Keep disabled at first:

- Require status checks to pass before merging
- Require deployments to succeed before merging
- Require signed commits
- Lock branch

Important owner setting:

- Do not enable "Do not allow bypassing the above settings"

This keeps the branch protected for collaborators while allowing the repository owner/admin to make emergency direct updates.
