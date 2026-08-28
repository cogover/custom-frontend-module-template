---
name: custom-module-foundation
description: Use when changing architecture, routing, Link navigation, providers, Module Federation, theme, or shared UI foundations in custom-module-template.
---

# Custom Module Foundation

Giữ custom module tương thích với router host và chạy ổn định ở cả production lẫn standalone.

## 1. Component expose

1. Repo chỉ expose `./CustomApp` từ `src/App.tsx`.
2. Giữ nguyên federation name, filename và expose key hiện tại.
3. Chỉ thêm expose mới sau khi user duyệt contract với router host.

## 2. Contract với router host

1. Router host mount module tại `/:appSlug/cN/*`.
2. Router host truyền `appSlug` vào `CustomApp` qua prop.
3. `AppSlugProvider` phân phối prop đó; component con đọc bằng `useAppSlug()`.
4. Standalone không có app slug; context trả chuỗi rỗng.

## 3. Router nội bộ

1. Không khai báo `:appSlug` hoặc `cN` trong router của custom module; router host đã quản lý hai segment này.
2. Khai báo mọi route tại `src/routes.tsx`; `App.tsx` chỉ map `APP_ROUTES` thành `<Route>`.
3. Path của page luôn tương đối.

Good:

```tsx
{
    key: 'request-detail',
    path: 'requests/:requestId',
    element: <RequestDetailPage />,
}
```

Bad:

```tsx
{
    path: ':appSlug/c1/requests/:requestId',
    element: <RequestDetailPage />,
}
```

## 4. Link nội bộ — bắt buộc

Mọi link được viết trong custom module phải dùng component của dự án:

```tsx
import Link from 'src/components/Link';

<Link to='/records'>Danh sách bản ghi</Link>
```

`Link` nội bộ chịu trách nhiệm gắn app slug ở production, giữ nguyên path ở standalone, tránh slug lặp và tránh URL dạng `//user`.

Không import trực tiếp từ React Router:

```tsx
import { Link } from 'react-router-dom';

<Link to='/records'>Danh sách bản ghi</Link>
```

URL trên có thể thiếu app slug, khiến router host redirect lại và giao diện nháy một lần.

Không tự nối app slug:

```tsx
const appSlug = useAppSlug();

<Link to={`/${appSlug}/records`}>Danh sách bản ghi</Link>
```

Cách này có thể tạo `//records` ở standalone hoặc gắn slug hai lần ở production.

Không dùng `<a href>` cho điều hướng nội bộ vì sẽ reload toàn trang và tải lại federation.

## 5. Provider

1. Production dùng Redux và Router context do host cung cấp.
2. Standalone dùng `MainProvider` và `DevConfigGate`.
3. Provider nội bộ chỉ giữ dữ liệu custom module thực sự cần.
4. Không dựng header, sidebar hoặc layout của host trong custom module.

## 6. Module Federation

1. Giữ React, React DOM, Redux và React Router trong `shared`.
2. Không thay đổi contract federation ở một repo duy nhất; kiểm tra cả custom module và router host.
3. Dùng import tường minh khi federation plugin yêu cầu string literal.

## 7. Theme và global style

1. Dùng variables trong `src/theme/variables.scss`.
2. Background dùng `--background-default`; text dùng `--typography-primary`.
3. Font dùng `var(--font, 'Nunito Variable')` và package `@fontsource-variable/nunito`.
4. Giữ global reset tương thích router.
5. Page phải hiển thị đúng ở cả light và dark theme.

## 8. UI convention nền tảng

1. Màu lấy từ design token trong `tailwind.config.js`.
2. Spacing và kích thước dùng `rem`.
3. Font size, weight và line-height dùng class `prose-*`.
4. Ghép class bằng `cx()` và nhóm theo layout, spacing, visual, typography, interaction.
5. Không hardcode giá trị khi dự án đã có token tương ứng.
