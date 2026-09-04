# Fix Serena startup configuration

**Updated**: 2026-09-04 16:51
**Status**: verified
**Refs**: .serena/project.yml:20, .serena/project.yml:176

## Context
Đọc khi Serena không thể khởi động project và báo `KeyError: 'languages'`.

## Key findings
- Serena 1.5.1 yêu cầu khóa `languages`; project trước đó chỉ có khóa mới `language_servers` nên MCP dừng khi nạp cấu hình.
- Giữ cả `languages` và `language_servers` với giá trị `typescript` để tương thích hai schema cấu hình.
- Thêm `additional_workspace_folders: []`, là trường mặc định Serena 1.5.1 tự bổ sung khi cấu hình thiếu.
- Verification: Serena MCP khởi động, kích hoạt project và TypeScript language server hoàn tất.

## Related memories
- `gotchas/serena-project-languages-required.md`
