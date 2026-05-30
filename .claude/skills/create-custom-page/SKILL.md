---
name: create-custom-page
description: >-
  Quy trình tạo 1 page mới trong dự án custom-module-template (custom module remote
  của Cogover). LUÔN dùng skill này khi user muốn "thêm page", "tạo page", "thêm màn
  hình", "thêm route", "thêm trang mới", "tạo custom page", hoặc thêm một đường dẫn/
  screen mới vào module — kể cả khi không nói chính xác chữ "page". Skill chỉ rõ phải
  tạo component trong src/pages/ và đăng ký vào APP_ROUTES (nguồn route DUY NHẤT, tự
  nối cả <Routes> lẫn left menu dev), cùng convention routing tương đối, styling token
  và i18n của dự án.
---

# Tạo custom page

Dự án này là **custom module remote**: `src/App.tsx` là component bare được expose ra
federation (`./CustomApp`). Host `router` mount nó dưới splat `*` tại `/:appSlug/cN/*`
và đã cung cấp sẵn provider + layout. Vì vậy mọi page phải dùng **routing tương đối**
và **không tự bọc provider/router/layout**.

Điểm mấu chốt: **`src/routes.tsx` là nguồn DUY NHẤT định nghĩa route.** Mảng `APP_ROUTES`
được `App.tsx` map ra `<Routes>` và `src/dev/MainLayout.tsx` map ra left menu (khi dev).
Thêm 1 entry vào đây là page tự xuất hiện ở cả route lẫn menu — **không sửa tay App.tsx
hay MainLayout.**

## Quy trình (3 bước)

### Bước 1 — Tạo component page

Tạo `src/pages/<TênPage>/index.tsx`, `export default` 1 component. Page là nội dung
thuần, **không** bọc `Routes`/`Provider`/layout.

```tsx
// src/pages/ReportPage/index.tsx
export default function ReportPage() {
    return (
        <div className='rounded-[0.5rem] border border-divider-primary bg-background-default p-[1rem]'>
            <h2 className='prose-h5 mb-[0.5rem] text-typo-primary'>Báo cáo</h2>
            <p className='prose-body2 text-typo-secondary'>Nội dung trang báo cáo.</p>
        </div>
    );
}
```

Page động đọc param bằng `useParams` (react-router-dom là singleton share với host):

```tsx
// src/pages/OrderPage/index.tsx
import { useParams } from 'react-router-dom';

export default function OrderPage() {
    const { orderId } = useParams();
    return <div className='prose-body2 text-typo-primary'>Đơn hàng: {orderId}</div>;
}
```

### Bước 2 — Đăng ký vào `APP_ROUTES` (`src/routes.tsx`)

Lazy-load page (federation tách chunk riêng) rồi thêm 1 entry. Shape của `AppRoute`:

| field | bắt buộc | ý nghĩa |
|---|---|---|
| `key` | ✅ | định danh ổn định (React key + map menu) |
| `name` | ✅ | nhãn hiển thị ở left menu (dev) |
| `to` | ✅ | đích điều hướng **tương đối** cho NavLink ở menu (rỗng `''` = index) |
| `path` | ❌ | path khai cho `<Route>`; bỏ trống = index route. Tách khỏi `to` khi route động (vd `path: 'order/:orderId'` nhưng `to: 'order/42'`) |
| `element` | ✅ | phần tử render (`<ReportPage />`) |

```tsx
const ReportPage = lazy(() => import('./pages/ReportPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));

export const APP_ROUTES: AppRoute[] = [
    // ...các route sẵn có
    { key: 'report', name: 'Báo cáo', to: 'report', path: 'report', element: <ReportPage /> },
    { key: 'order', name: 'Đơn hàng (mẫu)', to: 'order/42', path: 'order/:orderId', element: <OrderPage /> },
];
```

**Routing tương đối (quan trọng):** `to`/`path` **không** có leading slash. Host mount
remote dưới splat nên path tuyệt đối sẽ trỏ sai. Đúng một route được là index (`to: ''`,
không có `path`).

### Bước 3 — Verify

Chạy `npm run build` (đợi thấy `building for production…` là pass) và `npx eslint src`.
Mở dev (`npm run dev` hoặc preview) để thấy page mới trong left menu của `MainLayout` dev.

## Convention bắt buộc (tuân theo cogover-fe)

- **Styling:** chỉ dùng **design token** (`text-typo-primary`, `bg-background-default`,
  `border-divider-primary`, `text-primary-main`…), **không** raw hex / Tailwind default
  màu. Spacing bằng `rem` (`p-[1rem]`), typography bằng `prose-*` (`prose-h5`, `prose-body2`).
  Gom class có điều kiện bằng `cx` (`import cx from 'src/utils/cx'`).
- **CẤM FontAwesome:** eslint chặn cứng mọi import `@fortawesome/*`. Cần icon thì lấy từ
  `@stringeecom/ui-kit`.
- **Link/điều hướng trong page:** dùng `NavLink`/`Link`/`useNavigate` của **react-router-dom**
  (routing tương đối dưới splat host). KHÔNG dùng bản wrap của `@stringeecom/ui-kit` ở đây —
  nó ép path thành tuyệt đối `/<appSlug>/...` làm mất segment `/cN`.
- **import nội bộ:** dùng alias `src/...` khi relative vượt quá 2 cấp `..`.

## i18n (tuỳ chọn — chỉ khi cần đa ngôn ngữ)

Mặc định text mới viết **tiếng Việt** trực tiếp, không cần i18n trừ khi được yêu cầu. Khi cần:

1. Thêm key vào `src/languages/locales/vi-VN/app.json` và `src/languages/locales/en-US/app.json`
   (resource bundle local trong repo, không lấy từ dự án static).
2. Dùng trong page:

```tsx
import { useTranslation } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n';

export default function ReportPage() {
    const { t } = useTranslation(I18nNS.APP);
    return <h2 className='prose-h5 text-typo-primary'>{t('reportPage.title')}</h2>;
}
```

## Tuyệt đối KHÔNG

- KHÔNG sửa tay `<Routes>` trong `src/App.tsx` hay left menu trong `src/dev/MainLayout.tsx`
  — chúng map tự động từ `APP_ROUTES`. Chỉ sửa `src/routes.tsx`.
- KHÔNG bọc page bằng provider/router/layout — host (prod) và `main.tsx` (dev) đã lo.
- KHÔNG dùng path tuyệt đối (leading slash) cho `to`/`path`.
- KHÔNG import `@fortawesome/*`.
