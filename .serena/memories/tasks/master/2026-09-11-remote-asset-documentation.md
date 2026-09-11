# Làm rõ địa chỉ tài nguyên remote

**Updated**: 2026-09-11 10:42
**Status**: verified
**Refs**: README.md:53, README.md:61, CLAUDE.md:61, .agents/skills/custom-module-foundation/SKILL.md:115, .agents/skills/custom-module-foundation/SKILL.md:158, .agents/skills/custom-module-form-builder/SKILL.md:33, .agents/skills/custom-module-foundation/evals/evals.json:37, vite.config.ts:20

## Context

Đọc khi giải thích base tương đối hoặc cập nhật hướng dẫn tài nguyên tĩnh của custom module.

## Key findings

1. README và CLAUDE đã bỏ lệnh build/preview có --base theo slot; giữ base: './' trong Vite.
2. README, CLAUDE và hai skill foundation/form-builder làm rõ tài nguyên được Vite xử lý phải theo địa chỉ phục vụ remote, kèm ví dụ khác domain và host chuyển tiếp remote. Dùng một bản build ở nhiều slot là lợi ích đi kèm.
3. base không sửa chuỗi URL trực tiếp như /images/banner.png trong JSX; dùng import tài nguyên hoặc CSS tương đối.
4. Tiêu chí kiểm tra và eval số 6 chỉ yêu cầu /\_cm_N/assets/ khi đó là đường dẫn triển khai thực tế.
5. Chỉ sửa tài liệu và eval; Prettier, npm run lint, quick_validate.py cho hai skill và git diff --check đã đạt trước khi commit. Không chạy build hoặc kiểm thử trình duyệt trong thay đổi này.

## Related memories

1. `mem:tasks/master/2026-09-04-relative-federation-asset-base`
1. `mem:tasks/master/_index`
