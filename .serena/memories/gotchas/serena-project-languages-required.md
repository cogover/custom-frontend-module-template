# Serena 1.5.x requires languages

**Updated**: 2026-09-04 16:51
**Status**: verified
**Refs**: .serena/project.yml:20, .serena/project.yml:147

## Context
Đọc khi Serena báo `KeyError: 'languages'` hoặc project dùng đồng thời nhiều phiên bản Serena.

## Key findings
- Serena 1.5.1 đọc trực tiếp trường `languages` trong project config và không thay thế nó bằng `language_servers`.
- Cấu hình tương thích cần giữ `languages: [typescript]` cùng `language_servers: [typescript]`.

## Related memories
- `tasks/master/2026-09-04-fix-serena-startup.md`
