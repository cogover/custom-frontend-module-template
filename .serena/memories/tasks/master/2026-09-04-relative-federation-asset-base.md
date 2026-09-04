# Use relative base for federated assets

**Updated**: 2026-09-04 17:55
**Status**: verified
**Refs**: vite.config.ts:20, src/pages/WelcomePage/index.tsx:1, .agents/skills/custom-module-foundation/SKILL.md:111, .agents/skills/custom-module-foundation/evals/evals.json:22

## Context
Đọc khi asset import từ custom module bị resolve về `/assets/*` của router host hoặc khi một build cần chạy ở nhiều slot `/_cm_N/`.

## Key findings
- Đặt `base: './'` trong Vite config để `npm run build` tạo URL asset tương đối theo `import.meta.url` thay vì hardcode `/assets/*`.
- Output đã xác nhận logo được build thành `new URL('cogover-logo-*.svg', import.meta.url).href`.
- Chạy qua router tại `/settings/c1`, browser resolve logo thành `/_cm_1/assets/cogover-logo-*.svg`; ảnh tải đủ `naturalWidth: 32` và không có lỗi console liên quan remoteEntry hoặc logo.
- Skill `custom-module-foundation` áp dụng cùng quy tắc cho image, SVG, video, audio, font, download, poster, source và CSS `url(...)`; cấm `public`, root-relative asset URL, hardcode slot và `--base=/_cm_N/`.
- Evals bao phủ media tổng hợp và một dist chạy ở nhiều slot chỉ với `npm run build`.
- Verification: `npx prettier --write vite.config.ts`, `npx eslint vite.config.ts`, `npm run build`, kiểm tra output không còn `"/assets/cogover-logo-*"`, và smoke test qua router local.

## Related memories
- `mem:tasks/master/remove-ui-kit-and-app-slug`
