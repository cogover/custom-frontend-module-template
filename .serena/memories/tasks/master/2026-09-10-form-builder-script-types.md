# FormBuilder script types and inline examples

**Updated**: 2026-09-10 13:37
**Status**: verified
**Refs**: src/types/form-builder.d.ts:1

## Context
User requested complete screen and execScript type definitions for federation components, with hover-visible examples instead of a separate guide.

## Key findings
- Added local declaration-only FormBuilderApi, FormBuilderComponentProps, FormBuilderScript/Context/Screen and all screen element, related-list row/cell/column and record types.
- Mirrored current ui-kit screen contract without importing ui-kit at runtime. Existing optional methods and nullable lookup results preserved.
- All 15 exported type declarations and key methods have JSDoc @example blocks. Separate docs file was removed at user request.
- Verified TypeScript structural compatibility against extracted ui-kit declarations, project tsc --noEmit, Prettier and scoped ESLint with zero warnings. Checked editor documentation metadata for execScript.
- No build. User requested commit only; planned federation/FormBuilder skill remains pending review.

## Related memories
- `tasks/master/2026-09-09-add-published-client-sdk`
