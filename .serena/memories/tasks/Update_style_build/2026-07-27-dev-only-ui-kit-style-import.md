# Dev-only ui-kit style import

**Updated**: 2026-07-27 14:50
**Status**: verified
**Refs**: src/main.tsx, src/importUiKitStyle.ts

## Context
Use this when checking why custom-module-template loads ui-kit styles only in standalone dev/test.

## Key findings
- `src/main.tsx` imports `./importUiKitStyle` instead of statically importing the ui-kit stylesheet.
- `src/importUiKitStyle.ts` dynamically imports `@stringeecom/ui-kit/style.css` only when `process.env.NODE_ENV` is `development` or `test`.
- This keeps standalone dev/test styling while avoiding static production CSS bundling.

## Related memories
- `tasks/Update_style_build/`
