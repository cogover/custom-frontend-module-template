# Remove ui-kit and add app-slug contract

**Updated**: 2026-08-28 12:43
**Status**: verified
**Refs**: src/App.tsx:17, src/main.tsx:17, src/routes.tsx:10, src/styles/index.css:1, src/providers/AppSlugProvider.tsx:7, src/components/Link.tsx:11

## Context
Đọc khi cần hiểu template custom module sau khi bỏ `@stringeecom/ui-kit` hoặc cách remote nhận và phân phối `appSlug`.

## Key findings
- Remote `CustomApp` nhận `appSlug` qua prop federation và phân phối bằng `AppSlugProvider`/`useAppSlug`; standalone dùng chuỗi rỗng.
- `Link` nội bộ chuẩn hóa app slug, giữ nguyên đường dẫn khi slug rỗng, và hỗ trợ `withAppSlug={false}`.
- `Avatar`, theme, HTTP types/client được triển khai nội bộ; Typography được thay bằng HTML semantic cùng token `prose-*`.
- Toast nội bộ và toàn bộ hướng dẫn `.claude/skills` cũ đã bị loại bỏ.
- Standalone render thẳng page; dev `Header`, `Sidebar/MainLayout` và metadata menu trong `APP_ROUTES` đã bị xóa.
- Global CSS đồng bộ phần nền tảng với router: reset box model, Nunito qua `--font`, text/background dùng theme variables; không copy selector phụ thuộc ui-kit.
- Verification: Prettier, ESLint, TypeScript và Vite build đã chạy thành công cho custom-module-template.

## Related memories
- `tasks/Update_style_build/2026-07-27-dev-only-ui-kit-style-import.md`
