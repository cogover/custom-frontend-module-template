# Add published client SDK dependency

**Updated**: 2026-09-09 17:30
**Status**: verified
**Refs**: package.json:15, package-lock.json:468

## Context
User requested installing @cogover/client-sdk in custom-module-template and committing/pushing to master.

## Key findings
- Added ^0.1.0 dependency and public npm lockfile tarball/integrity with its transitive dependencies.
- npm install completed; npm ls confirms 0.1.0 and filesystem inspection confirms installation is not a local symlink.
- Installation used a command-scoped public registry override; no project registry configuration change made.
- No build performed. Untracked SPT-2984.md and test.txt are unrelated and excluded from commit.

## Related memories
- `tasks/master/_index`
