# Changelog

## Chưa phát hành

1. Module dùng nền tảng Cogover qua hợp đồng công khai của `@cogover/client-sdk`: cấu hình đọc bằng `useLibrary()`, component trên layout nhận `formBuilder` gồm đúng `execScript`, `refreshRecordDetail`, `record`, `mode`, `objectSlug`; kiểu lấy từ `@cogover/client-sdk`.
2. Cần nền tảng Cogover phát hành cùng `@cogover/client-sdk` 0.4.0. Trên nền tảng cũ, `formBuilder.record`/`mode`/`objectSlug` và `commonSettings.apps` là `undefined`: module phải kiểm tồn tại trước khi dùng. Component `./Components/*` còn cần nền tảng cấp `@cogover/client-sdk` cho module (có trên nền tảng từ 09/2026).
3. Store Redux của module không còn chia sẻ với nền tảng: `react-redux`, `@reduxjs/toolkit` bỏ khỏi `shared`; `App` và các component `./Components/*` tự bọc store riêng.
4. Component `./Components/*` được build tự bọc `AppSlugProvider`, request gửi `X-App-Slug` theo app đang mở.
5. Quy tắc "Chạy trên mobile" (M1–M7) và ESLint chặn kênh nội bộ giữa trang Cogover và ứng dụng mobile, hộp thoại trình duyệt, chiều cao theo màn hình trong component.
