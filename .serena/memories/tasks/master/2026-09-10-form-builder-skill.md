# FormBuilder federation component skill

**Updated**: 2026-09-10 14:17
**Status**: verified
**Refs**: .agents/skills/custom-module-form-builder/SKILL.md:1, src/types/form-builder.d.ts:1

## Context
User approved and requested committing the skill for federation components that control FormBuilder via execScript callbacks.

## Key findings
- Added custom-module-form-builder skill covering expose paths, host props, local type reuse, native callbacks, screen operations, errors and validation.
- Explains why existing CustomApp export is preserved and relative Vite base makes assets portable across slots. Components prefix is a host convention, not a federation requirement.
- New components pass functions directly; no stringify/eval path. Examples are reused from type JSDoc, not duplicated in a separate guide.
- Skill validator passed via uv with PyYAML; reference paths verified. No build needed for this documentation change.
- Untracked huong-dan-viet-layout-script-form-builder.md is excluded from this commit.

## Related memories
- `tasks/master/2026-09-10-form-builder-script-types`
