# custom-module-template

Tài liệu tổng quan repository `custom-module-template`.

## Project Overview

`custom-module-template` là **skeleton/template để tạo 1 Custom Module** trong hệ Module Federation Cogover — một **remote** chỉ expose đúng 1 component bare `./CustomApp` (`src/App.tsx`), được host `router` mount dưới slot `/:appSlug/cN/*`.

- Federation `name: 'cmTemplate'`, `exposes: { './CustomApp': './src/App.tsx' }`, `remotes` rỗng (không tiêu thụ remote nào). Cấu hình **inline thẳng** trong `vite.config.ts` (không còn `src/federation/`).
- `App.tsx` là **component BARE**: KHÔNG bọc provider / router / layout. Khi chạy trong host, host đã cung cấp sẵn provider + Router context + MainLayout. Toàn bộ provider/layout chỉ phục vụ **chế độ dev standalone**.
- Routing dùng **path TƯƠNG ĐỐI** (không leading slash) vì host mount remote dưới splat `*`.
- Đã loại bỏ FontAwesome khỏi code dự án (eslint chặn cứng import `@fortawesome/*`); ui-kit vẫn dùng nó nội bộ như transitive dep.

## Cấu trúc `src/`

```
src/
├── App.tsx              # Component EXPOSE (bare): Suspense + <Routes> map từ APP_ROUTES
├── routes.tsx           # APP_ROUTES — nguồn DUY NHẤT định nghĩa route {key,name,to,path?,element}
├── main.tsx             # Entry STANDALONE (dev): BrowserRouter > MainProvider > DevConfigGate > MainLayout > App
├── pages/               # HelloPage (tĩnh, index) + UserPage (động, user/:userId)
├── dev/                 # CHỈ DÙNG KHI DEV — KHÔNG expose
│   ├── DevConfigGate.tsx   # Gọi API config-server → đổ vào Redux, render children sau khi xong
│   ├── MainLayout.tsx      # Khung sidebar (map APP_ROUTES) + Header + Outlet(children)
│   ├── Header.tsx          # Port TopToolbar end-user: workspace name + title + avatar Popper
│   └── UserMenu.tsx        # Menu user, chỉ 1 item logout (dev stub)
├── providers/           # MainProvider: ReduxProvider > ReactQueryProvider > ThemeProvider
│   └── ThemeProvider.tsx   # Bọc StringeeThemeProvider + I18nProvider + StringeeUtilProvider (ui-kit)
├── store/               # configureStore — chỉ slice commonSettings
├── languages/           # i18n bundle LOCAL (xem mục i18n bên dưới)
├── apis/                # apiBase (re-export Http từ ui-kit), apiErrorHandler, config/, account/ (types)
├── utils/ · theme/ · styles/
```

### Expose vs Dev
- **Expose ra host**: chỉ `App.tsx` (qua `./CustomApp`). App bare, dùng `APP_ROUTES`.
- **Dev-only** (mô phỏng môi trường host khi chạy riêng): `main.tsx`, `providers/`, `dev/*`. KHÔNG được import các thứ này vào `App.tsx` hay pages.

### Thêm page mới
Sửa **chỉ** `src/routes.tsx`: thêm entry vào `APP_ROUTES` (`App.tsx` map ra `<Routes>`, `dev/MainLayout` map ra left menu — tự nối cả hai). KHÔNG sửa tay `App.tsx`/`MainLayout`. Chi tiết: skill nội bộ `create-custom-page`.

## i18n (khác chuẩn Cogover)
Resource **bundle LOCAL** trong repo: `src/languages/locales/<lng>/<ns>.json`, nạp qua `import.meta.glob` trong `src/languages/i18n.ts` — **KHÔNG** fetch từ dự án `static`. Sửa bản dịch = sửa thẳng file JSON trong repo. Dùng `useTranslation`/`Trans` từ `src/languages/global`, namespace từ `I18nNS` (APP/COMMON). Mặc định text mới viết tiếng Việt trực tiếp, không tự i18n. Chi tiết: skill nội bộ `i18n-translation`.

## Chạy qua host `router`
Convention host: `/<appSlug>/cN/...` → `remoteCmN/CustomApp`. Host fetch remoteEntry tại `/_cm_N/assets/remoteEntry.js` (proxy `/_cm_N` → `VITE_FEDERATION_CUSTOM_N_ORIGIN`).

1. Build template với base của slot: `npm run build -- --base=/_cm_N/`.
2. Preview: `npm run preview -- --base=/_cm_N/ --port <port> --strictPort` (template chạy HTTPS qua basicSsl + cert wildcard).
3. Bên `router/.env.local`: thêm `VITE_FEDERATION_CUSTOM_N_ORIGIN="https://localhost:<port>"` rồi `npm run dev` (host port 5002).
4. Truy cập `https://<workspace>.cogover.local:5002/cN` (host tự chèn `appSlug`).

Slot 1/2 đang là cm1/cm2.

## Phát triển local & đóng gói gửi Cogover

### Cấu hình `.env`
Copy `.env.sample` → `.env.local` (file `.env.local` đã được gitignore, chứa giá trị thật).

> **Thực tế chỉ cần quan tâm 2 biến: `VITE_WORKSPACE_NAME` và `VITE_ENVIRONMENT`.** Các biến URL còn lại (`VITE_API_BASE_URL`, `VITE_LOCAL_HOST`…) tự suy ra từ 2 biến này, không cần chỉnh.

Tham khảo ý nghĩa các biến (đọc trong `vite.config.ts`):

| Biến | Dùng để | Ghi chú |
|---|---|---|
| `VITE_WORKSPACE_NAME` | tên workspace (domain) | dùng suy ra các URL khác, vd `long04` |
| `VITE_ENVIRONMENT` | hậu tố môi trường | vd `.cogover.net` |
| `VITE_API_BASE_URL` | target proxy `/api`, `/files`, `/websocket`, `/static` | mặc định `https://${VITE_WORKSPACE_NAME}${VITE_ENVIRONMENT}` |
| `VITE_LOCAL_HOST` | host của dev server | `${VITE_WORKSPACE_NAME}.cogover.local` — cần map về `127.0.0.1` trong `/etc/hosts` |
| `VITE_CERT_KEY_PATH` / `VITE_CERT_PATH` | cert wildcard cho HTTPS | **tuỳ chọn**; nếu KHÔNG set → vite tự dùng `basicSsl` (self-signed) |

> Các biến khác trong `.env.sample` (`VITE_PAYPAL_*`, `VITE_STRIPE_*`, `VITE_SUBSCRIPTION_*`, `VITE_ACCOUNT_*`, `VITE_ID_*`, `VITE_END_USER_*`…) là kế thừa từ template gốc, custom module này hiện **không dùng** — có thể bỏ qua. Lưu ý `.env.sample` chưa có `VITE_CERT_*`; thêm vào `.env.local` nếu muốn dùng cert thật thay cho self-signed.

### Chạy dev (standalone)
1. Cài deps (cần `.npmrc` trỏ registry Stringee): `npm install` (hoặc `npm run install-deps:dev`).
2. `npm run dev` → Vite dev server tại `https://<VITE_LOCAL_HOST>:5100` (HTTPS qua basicSsl, tự mở browser).
   - Entry standalone (`main.tsx`) bọc `MainProvider` + `DevConfigGate` + `MainLayout` để giả lập môi trường host.
   - `DevConfigGate` gọi API `config-server`; nếu cần token thì truyền qua query `?authToken=<token>`.
3. Sửa code → HMR tự reload. Thêm page mới chỉ cần sửa `APP_ROUTES` (`src/routes.tsx`).

### Sau khi code xong: build & đóng gói gửi Cogover
1. **Lint** (eslint không chạy trong `build`, chỉ chạy lúc `serve`): `npm run lint`.
2. **Build**: `npm run build` (= `tsc && vite build`) → sinh thư mục `dist/` (gồm `dist/assets/remoteEntry.js` + các chunk).
   - Build cho slot được cấp: `npm run build -- --base=/_cm_N/` (N = số slot Cogover gán cho module). Base phải khớp slot để host fetch đúng `/_cm_N/assets/remoteEntry.js`.
3. **Đóng gói** thư mục `dist/` thành 1 file nén:
   ```bash
   cd dist && zip -r ../custom-module-dist.zip . && cd ..
   ```
4. **Gửi lên Cogover**: upload gói `dist` (zip) qua trang quản lý Custom Module của Cogover, gán vào slot `cN`. Sau đó host nạp module tại route `/<appSlug>/cN/...`.

## Skills nội bộ (`.claude/skills/`) — DÙNG KHI CODE

Khi làm việc với code trong dự án này, **BẮT BUỘC** kích hoạt skill phù hợp trước khi implement:

| Khi nào | Dùng skill |
|---|---|
| Viết/sửa/review UI, component, form, dùng `@stringeecom/ui-kit`, design token | **`cogover-fe`** |
| Thêm/tạo page, route, màn hình, đường dẫn mới | **`create-custom-page`** |
| Dịch, đa ngôn ngữ, thêm/sửa key i18n | **`i18n-translation`** |

- **`cogover-fe`** — UI Kit + convention FE.
- **`create-custom-page`** — quy trình tạo 1 page mới (pages + APP_ROUTES + convention routing/token).
- **`i18n-translation`** — quy trình đa ngôn ngữ theo cách dự án này (resource bundle local, không dùng dự án `static`).

> Nhiều việc dùng kết hợp: vd "code UI cho 1 page mới" → `create-custom-page` (cấu trúc route/page) + `cogover-fe` (styling/component); thêm text đa ngôn ngữ → kèm `i18n-translation`.

## Convention chính
- Styling: design token (`text-typo-primary`, `bg-background-default`, `border-divider-primary`…), spacing `rem`, typography `prose-*`, gom class bằng `cx` (`src/utils/cx`).
- CẤM import `@fortawesome/*` (eslint error). Cần icon → lấy từ `@stringeecom/ui-kit`.
- Link/điều hướng **trong page/dev** dùng `react-router-dom` (KHÔNG bản wrap ui-kit — nó ép path tuyệt đối `/<appSlug>/...` làm mất segment `/cN`).
- `npm run build` = `tsc && vite build`; eslint chỉ chạy lúc `serve` (gate trong `vite.config.ts`), build dùng `npm run lint` riêng.

---

## Federation Architecture Overview (hệ sinh thái Cogover — reference)

Tài liệu chung của hệ Module Federation Cogover. **Lưu ý**: nhiều dự án khác dùng factory `src/federation/federation.config.tsx`; riêng template này đã inline vào `vite.config.ts`.

### 1. Stack chung
**Vite 5** + **React 18** + **`@originjs/vite-plugin-federation`**. Các remote khác nạp federation qua factory nhận `*Origin` từ env (`VITE_REMOTE_*_ORIGIN`).

### 2. Bản đồ các app

| Dự án | Federation `name` | Vai trò | Module export chính |
|---|---|---|---|
| **router** | `workspace` (host) | Host, chỉ tiêu thụ — không expose | – |
| **custom-module-template** | `cmTemplate` | Skeleton Custom Module (slot `cN`) | `./CustomApp` |

### 3. URL contract (proxy của host `router`)
Mỗi remote dùng `/<namespace>/assets/remoteEntry.js`: `/_workspace`, `/_workspace_2` (process), `/_end_user`, `/_subscription`, `/_sla`, `/_report_builder`, `/_chat`, `/_call_center`, `/_cgv_admin`, `/o` (root). Custom module dùng **20 slot** `/_cm_1` … `/_cm_20` → `remoteCm1..20/CustomApp`.

### 4. Shared dependencies
`react`, `react-dom`, `react-redux`, `@reduxjs/toolkit`, `react-router-dom`, `@stringeecom/ui-kit`, `@tanstack/react-query`, `react-hook-form`, `yup`, `dayjs`. (Template này dùng đúng tập trên.)

### 5. Vị trí của `@stringeecom/ui-kit`
ui-kit **không phải remote**, là **library độc lập** (private registry Stringee), khai báo ở `shared` của federation để host + mọi remote dùng chung 1 instance singleton. Chạy local: thêm alias `{ find: '@stringeecom/ui-kit', replacement: path.resolve(__dirname, '<path-to-ui-kit-source>') }` vào `vite.config.ts`.
