# Form Builder refresh API for custom modules

**Updated**: 2026-09-17 08:47
**Status**: verified
**Refs**: src/types/form-builder.d.ts:403, .agents/skills/custom-module-form-builder/SKILL.md:54

## Context
Document the parameterless record refresh API exposed to federation components embedded in Form Builder.

## Key findings
- `FormBuilderApi.refreshRecordDetail` is optional and accepts no record ID because the host binds the current Form Builder record.
- The API resolves to `FormBuilderRecord | null`.
- Components must check availability, await completion and handle errors locally.
- Refresh replaces current form data with the server record, so callers should save data or confirm discarding unsaved changes first.
- README and CLAUDE only route developers to the Form Builder skill and do not duplicate the API contract.

## Related memories
- `architecture/form-builder-federation-api`
