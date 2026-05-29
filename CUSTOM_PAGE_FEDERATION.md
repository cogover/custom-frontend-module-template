# Custom Page Federation — Tóm tắt hệ thống (SPT-2068)

Tài liệu này tóm tắt hệ thống **custom page** cho phép tenant (user) tự code tối đa **20 dự án remote**, mỗi dự án tự định nghĩa page riêng (kể cả route động), và được host `router` render bên trong `MainLayout` (sidebar + topbar đầy đủ).

> Repo này (`custom-module-template`) là **skeleton** để clone ra 1 custom module (cm1, cm2, …). Đọc thêm phần [Cách tạo 1 custom module mới](#5-cách-tạo-1-custom-module-mới).

---

## 1. Mục tiêu

- User tự code **tối đa 20 remote** (`cm1` … `cm20`), mỗi remote là 1 dự án độc lập.
- Mỗi remote expose đúng **1 component `./CustomApp`** — bên trong tự do tạo nhiều page, đặt route **tĩnh hoặc động** (`/user/:userId`).
- Page custom luôn nằm **trong 1 app** (`/:appSlug/...`) và **trong `MainLayout`** của Cogover.
- **Không cần cấu hình mapping** — theo convention: URL namespace `/cN` ⇒ remote `remoteCmN`.

---

## 2. Convention & URL contract

### Quy ước cốt lõi
```
/<appSlug>/cN/<đường-dẫn-trong-remote>   →   remoteCmN/CustomApp
```

- `appSlug` là app nào cũng được (không tham gia mapping).
- `cN` (`c1`, `c2`, …, `c20`) là namespace quyết định remote nào được load: `c1 → remoteCm1`, `c2 → remoteCm2`, …
- Phần sau `cN` là route nội bộ do remote tự xử lý bằng `<Routes>` của chính nó.

### Ví dụ
| URL | Remote được load | Route trong remote |
|---|---|---|
| `/my-app/c1/hello` | remoteCm1 | `hello` (tĩnh) |
| `/my-app/c1/user/42` | remoteCm1 | `user/:userId` → `userId = 42` |
| `/any-slug/c2/dashboard` | remoteCm2 | `dashboard` (tĩnh) |
| `/any-slug/c2/product/abc` | remoteCm2 | `product/:productId` → `productId = abc` |

### URL contract cho remoteEntry (proxy dev của host)
Mỗi slot proxy qua path namespace riêng:
```
/_cm_1/assets/remoteEntry.js   →   remoteCm1
/_cm_2/assets/remoteEntry.js   →   remoteCm2
...
/_cm_20/assets/remoteEntry.js  →   remoteCm20
```

---

## 3. Thay đổi phía host `router`

### 3.1 Federation config — `src/federation/federation.config.ts`
- Thêm param `customModuleOrigin` (từ `VITE_REMOTE_CUSTOM_MODULE_ORIGIN`).
- Sinh đủ **20 remote** `remoteCm1..remoteCm20` trỏ tới `${customModuleOrigin}/_cm_N/assets/remoteEntry.js`.
- Prod không set env → origin rỗng → relative → tự lấy self origin (logic mặc định, giống các remote khác).

### 3.2 Slot loaders — `src/customPage/slotLoaders.ts` (mới)
- Khai báo **tĩnh** 20 dynamic import (`remoteCm1/CustomApp` … `remoteCm20/CustomApp`) — federation yêu cầu import string literal, không thể loop.
- `slotNameFromNamespace('c1') → 'remoteCm1'`.
- `CUSTOM_SLOT_NAMESPACES = ['c1' … 'c20']` để host build route.

### 3.3 Loader component — `src/customPage/CustomPageLoader.tsx` (mới)
- Đọc namespace `cN` từ `pathname`, resolve ra slot, `lazy()` import remote.
- Bọc trong `ErrorBoundary` + `Suspense`, dùng **UI báo lỗi sẵn có của dự án** (`ErrorFallback`, `MainContentErrorFallback`, `ErrorUI`):
  - Sai/không tồn tại slot → "Không tìm thấy trang" thân thiện.
  - Remote load fail → error boundary giữ lỗi **bên trong `MainLayout`** (không vỡ toàn trang).

### 3.4 Router — `src/router/router.tsx`
- Xoá logic embed `/c` StringeeX cũ (không còn nhúng Cogover trong StringeeX).
- Sinh route cho cả 20 namespace `cN`, mỗi route bọc `PrivateRoute > MainLayout`, child splat `*` lazy-load `CustomPageLoader`.

### 3.5 Type declarations — `src/customPage/remoteModules.d.ts` (mới)
- 20 block `declare module 'remoteCmN/CustomApp'`.

### 3.6 Dev proxy — `vite.config.ts`
- Mỗi slot proxy tới origin riêng qua env `VITE_FEDERATION_CUSTOM_N_ORIGIN`:
  ```ts
  // _cm_1 → VITE_FEDERATION_CUSTOM_1_ORIGIN, _cm_2 → VITE_FEDERATION_CUSTOM_2_ORIGIN, ...
  ```
- Chỉ slot nào set env mới tạo proxy → ai chạy dev local tự thêm env cho slot mình cần.

### 3.7 Env (ví dụ `.env.local` của router)
```bash
# Origin chứa remoteEntry trên URL federation (dev trỏ self để qua proxy)
VITE_REMOTE_CUSTOM_MODULE_ORIGIN="https://<ws>.cogover.local:5002"
# Target proxy cho từng slot (chỉ thêm slot cần chạy)
VITE_FEDERATION_CUSTOM_1_ORIGIN="http://localhost:5101"
VITE_FEDERATION_CUSTOM_2_ORIGIN="http://localhost:5102"
```

---

## 4. Yêu cầu bắt buộc với remote (custom module)

1. **Expose** đúng `./CustomApp` (default export là 1 React component).
2. `base` của Vite = `/_cm_N/` (đúng số slot).
3. **`shared` phải có `react`, `react-dom`, `react-router-dom`** — đặc biệt `react-router-dom` **bắt buộc singleton** để `useParams()` trong remote đọc được param từ host router.
4. Bên trong `CustomApp` dùng `<Routes>` với path **tương đối** (không có leading slash): `hello`, `user/:userId` … vì host đã mount remote dưới splat `*`.

---

## 5. Cách tạo 1 custom module mới

1. Clone repo này (`custom-module-template`) → ví dụ `cm3`.
2. Trong `vite.config.ts`:
   - `base: '/_cm_3/'`
   - `federation({ name: 'cm3', exposes: { './CustomApp': './src/CustomApp.tsx' }, shared: ['react','react-dom','react-router-dom'] })`
   - chọn `server.port` / `preview.port` riêng (vd 5103).
3. Code page trong `src/CustomApp.tsx` (dùng `<Routes>` path tương đối).
4. Bên `router`, thêm env `VITE_FEDERATION_CUSTOM_3_ORIGIN="http://localhost:5103"`.
5. Truy cập `/<appSlug>/c3/...`.

---

## 6. Demo đã dựng

2 dự án mẫu ngang cấp `router` (`../cm1`, `../cm2`), mỗi dự án 2 page (1 tĩnh + 1 động):

| Remote | Port | Page tĩnh | Page động |
|---|---|---|---|
| **cm1** (`remoteCm1`, `/c1`) | 5101 | `hello` | `user/:userId` |
| **cm2** (`remoteCm2`, `/c2`) | 5102 | `dashboard` | `product/:productId` |

Cách chạy demo:
```bash
# remote
cd cm1 && npm run build && npm run preview   # :5101
cd cm2 && npm run build && npm run preview   # :5102
# host
cd router && npm run dev                       # :5002
```
Đã verify trên browser: `c1/user/123`, `c2/product/abc` (param OK), `c5` (chưa có repo → UI báo lỗi thân thiện trong layout), `c1/sai-path` (remote tự render NotFound).

---

## 7. Giới hạn đã biết

- `cN` ngoài range 1–20 (vd `c99`) → host không sinh route → 404 toàn cục (không có layout). Đây là giới hạn chấp nhận được vì pool cố định 20 slot.
- 20 dynamic import phải viết tay (không loop được) do ràng buộc string literal của Module Federation.

---

_Tài liệu này tóm tắt công việc của task **SPT-2068**. Cập nhật: 2026-05-29._
