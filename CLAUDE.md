# CLAUDE.md

File này cung cấp hướng dẫn cho Claude Code khi làm việc với repository `custom-module-template`.

## Project Overview

`custom-module-template` là **skeleton/template để tạo 1 Custom Module** trong hệ Module Federation Cogover — một **remote** chỉ expose đúng 1 component `./CustomApp` (`src/App.tsx`), được host `router` mount dưới slot `/:appSlug/cN/*`.

-   Federation `name: 'cmTemplate'`, `exposes: { './CustomApp': './src/App.tsx' }`, `remotes` rỗng (không tiêu thụ remote nào). Cấu hình **inline thẳng** trong `vite.config.ts` (không còn `src/federation/`).
-   `App.tsx` chỉ tự bọc `AppSlugProvider`; Redux, Router và MainLayout do host cung cấp. Các provider còn lại chỉ phục vụ **chế độ dev standalone**.
-   Routing dùng **path TƯƠNG ĐỐI** (không leading slash) vì host mount remote dưới splat `*`.
-   Đã loại bỏ FontAwesome khỏi code dự án; eslint chặn cứng import `@fortawesome/*`.

## Cấu trúc `src/`

```
src/
├── App.tsx              # Component EXPOSE: AppSlugProvider + Suspense + Routes
├── assets/              # Image/static asset được Vite xử lý cho federation
├── components/          # Component nội bộ dùng chung: Avatar, Link
├── routes.tsx           # APP_ROUTES — nguồn DUY NHẤT định nghĩa route {key,path?,element}
├── main.tsx             # Entry STANDALONE (dev): BrowserRouter > MainProvider > DevConfigGate > App
├── pages/               # WelcomePage — Custom Page giới thiệu tối giản
├── dev/                 # CHỈ DÙNG KHI DEV — KHÔNG expose
│   └── DevConfigGate.tsx   # Gọi API config-server → đổ vào Redux, render children sau khi xong
├── providers/           # MainProvider: Redux > React Query > Theme > AppSlugProvider
│   └── ThemeProvider.tsx   # Đồng bộ data-theme cho chế độ standalone
├── store/               # configureStore — chỉ slice commonSettings
├── languages/           # i18n bundle LOCAL (xem mục i18n bên dưới)
├── apis/                # Axios client, retry, apiErrorHandler, config/, account/ (types)
├── utils/ · theme/ · styles/
```

### Expose vs Dev

-   **Expose ra host**: chỉ `App.tsx` (qua `./CustomApp`). App dùng `AppSlugProvider` và `APP_ROUTES`.
-   Host `router` truyền prop `appSlug` từ route `/:appSlug/cN/*`; `AppSlugProvider` phân phối giá trị này qua `useAppSlug()`.
-   Chế độ standalone/dev không có app slug; `useAppSlug()` trả chuỗi rỗng.
-   **Dev-only**: `main.tsx`, `MainProvider`, `DevConfigGate`; standalone render thẳng nội dung page.

### Thêm page mới

Sửa **chỉ** `src/routes.tsx`: thêm entry vào `APP_ROUTES`; `App.tsx` tự map ra `<Routes>`.

## i18n (khác chuẩn Cogover)

Resource **bundle LOCAL** trong repo: `src/languages/locales/<lng>/<ns>.json`, nạp qua `import.meta.glob` trong `src/languages/i18n.ts` — **KHÔNG** fetch từ dự án `static`. Sửa bản dịch = sửa thẳng file JSON trong repo. Dùng `useTranslation`/`Trans` từ `src/languages/global`, namespace từ `I18nNS` (APP/COMMON). Mặc định text mới viết tiếng Việt trực tiếp, không tự i18n.

## Chạy qua host `router`

Convention host: `/<appSlug>/cN/...` → `remoteCmN/CustomApp`. Host fetch remoteEntry tại `/_cm_N/assets/remoteEntry.js` (proxy `/_cm_N` → `VITE_FEDERATION_CUSTOM_N_ORIGIN`).

1. Build template với `base: './'` có sẵn: `npm run build`. Không truyền `--base` theo slot.
2. Preview: `npm run preview -- --port <port> --strictPort` (template chạy HTTPS qua basicSsl + cert wildcard).
3. Bên `router/.env.local`: thêm `VITE_FEDERATION_CUSTOM_N_ORIGIN="https://localhost:<port>"` rồi `npm run dev` (host port 5002).
4. Truy cập `https://<workspace>.cogover.local:5002/cN` (host tự chèn `appSlug`).

Slot 1/2 đang là cm1/cm2.

## Địa chỉ tài nguyên tĩnh của remote

`base: './'` giúp tài nguyên được Vite xử lý theo địa chỉ phục vụ remote (module được nhúng), thay vì theo domain của trang host (ứng dụng chủ). Với tài nguyên tham chiếu từ JavaScript, Vite dựa vào `import.meta.url` của file JavaScript remote; URL tương đối trong CSS được tính theo file CSS đang tải.

1. Remote khác domain host: host ở `https://app.example.com`, file JavaScript remote ở `https://remote.example.com/assets/page.js` thì ảnh được build thành `banner-HASH.png` trong cùng thư mục phải tải từ `https://remote.example.com/assets/banner-HASH.png`, không phải `https://app.example.com/assets/banner-HASH.png`.
2. Remote được host chuyển tiếp: file JavaScript tải từ `https://app.example.com/_cm_1/assets/page.js` thì ảnh theo `https://app.example.com/_cm_1/assets/banner-HASH.png`. Domain có thể trùng host nhưng đường dẫn phải phục vụ đúng remote.

Đặt ảnh, video, audio, font và file tải xuống trong `src/assets`, import URL trong TypeScript/TSX; CSS dùng `url(...)` tương đối tới file nguồn. `base: './'` không tự sửa chuỗi URL viết trực tiếp như `/images/banner.png` trong JSX — đường dẫn đó vẫn trỏ về domain host.

Dùng cùng một bản build ở nhiều slot là lợi ích đi kèm. Không bắt buộc URL tài nguyên khác domain host hoặc luôn có tiền tố `/_cm_N/`; phải khớp địa chỉ thực tế phục vụ remote. Chi tiết xem [custom-module-foundation](.agents/skills/custom-module-foundation/SKILL.md#9-static-asset--critical).

## Phát triển local & đóng gói gửi Cogover

### Cấu hình `.env`

Copy `.env.sample` → `.env.local` (file `.env.local` đã được gitignore, chứa giá trị thật).

> **Thực tế chỉ cần quan tâm 2 biến: `VITE_WORKSPACE_NAME` và `VITE_ENVIRONMENT`.** Các biến URL còn lại (`VITE_API_BASE_URL`, `VITE_LOCAL_HOST`…) tự suy ra từ 2 biến này, không cần chỉnh.

Tham khảo ý nghĩa các biến (đọc trong `vite.config.ts`):

| Biến                                    | Dùng để                                                | Ghi chú                                                                            |
| --------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `VITE_WORKSPACE_NAME`                   | tên workspace (domain)                                 | dùng suy ra các URL khác, vd `long04`                                              |
| `VITE_ENVIRONMENT`                      | hậu tố môi trường                                      | vd `.cogover.net`                                                                  |
| `VITE_API_BASE_URL`                     | target proxy `/api`, `/files`, `/websocket`, `/static` | mặc định `https://${VITE_WORKSPACE_NAME}${VITE_ENVIRONMENT}`                       |
| `VITE_LOCAL_HOST`                       | host của dev server                                    | `${VITE_WORKSPACE_NAME}.cogover.local` — cần map về `127.0.0.1` trong `/etc/hosts` |
| `VITE_CERT_KEY_PATH` / `VITE_CERT_PATH` | cert wildcard cho HTTPS                                | **tuỳ chọn**; nếu KHÔNG set → vite tự dùng `basicSsl` (self-signed)                |

> **Bắt buộc để `npm run dev` chạy được:** `.env` phải trỏ tới 1 **workspace thật** (vd môi trường master `.cogover.net`, release `.release.cogover.net`) **và** map domain `<workspace_slug>.cogover.local` → `127.0.0.1` trong `/etc/hosts`.
>
> Ví dụ với:
>
> ```
> VITE_WORKSPACE_NAME=long04
> VITE_ENVIRONMENT=.cogover.net
> ```
>
> thì cần set host:
>
> ```
> 127.0.0.1 long04.cogover.local
> ```

> `.env.sample` không kèm `VITE_CERT_*`; thêm vào `.env.local` nếu muốn dùng cert thật thay cho self-signed.

### Chạy dev (standalone)

1. Cài dependency: `npm install`.
2. `npm run dev` → Vite dev server tại `https://<VITE_LOCAL_HOST>:5100` (HTTPS qua basicSsl, tự mở browser).
    - Entry standalone (`main.tsx`) bọc `MainProvider` + `DevConfigGate`, sau đó render thẳng page.
    - `DevConfigGate` gọi API `config-server`; nếu cần token thì truyền qua query `?authToken=<token>`.
3. Sửa code → HMR tự reload. Thêm page mới chỉ cần sửa `APP_ROUTES` (`src/routes.tsx`).

### Sau khi code xong: build & đóng gói gửi Cogover

1. **Lint** (eslint không chạy trong `build`, chỉ chạy lúc `serve`): `npm run lint`.
2. **Build**: `npm run build` (= `tsc && vite build`) → sinh thư mục `dist/` (gồm `dist/assets/remoteEntry.js` + các chunk).
    - Giữ `base: './'`, không truyền `--base` theo slot. Cùng thư mục `dist/` dùng được ở các địa chỉ phục vụ remote khác nhau; đường dẫn nạp remote do host cấu hình.
3. **Đóng gói** thư mục `dist/` thành 1 file nén:
    ```bash
    cd dist && zip -r ../custom-module-dist.zip . && cd ..
    ```
4. **Gửi lên Cogover**: upload gói `dist` (zip) qua trang quản lý Custom Module của Cogover, gán vào slot `cN`. Sau đó host nạp module tại route `/<appSlug>/cN/...`.

## Convention chính

-   Styling: design token (`text-typo-primary`, `bg-background-default`, `border-divider-primary`…), spacing `rem`, typography `prose-*`, gom class bằng `cx` (`src/utils/cx`).
-   CẤM import `@fortawesome/*` (eslint error). Khi cần icon, dùng asset SVG thuộc dự án.
-   Link/điều hướng **trong page/dev** dùng `react-router-dom` với path tương đối.
-   `npm run build` = `tsc && vite build`; eslint chỉ chạy lúc `serve` (gate trong `vite.config.ts`), build dùng `npm run lint` riêng.

---

## Federation Architecture Overview (hệ sinh thái Cogover — reference)

Tài liệu chung của hệ Module Federation Cogover. **Lưu ý**: nhiều dự án khác dùng factory `src/federation/federation.config.tsx`; riêng template này đã inline vào `vite.config.ts`.

### 1. Stack chung

**Vite 5** + **React 18** + **`@originjs/vite-plugin-federation`**. Các remote khác nạp federation qua factory nhận `*Origin` từ env (`VITE_REMOTE_*_ORIGIN`).

### 2. Bản đồ các app

| Dự án                      | Federation `name`  | Vai trò                            | Module export chính |
| -------------------------- | ------------------ | ---------------------------------- | ------------------- |
| **router**                 | `workspace` (host) | Host, chỉ tiêu thụ — không expose  | –                   |
| **custom-module-template** | `cmTemplate`       | Skeleton Custom Module (slot `cN`) | `./CustomApp`       |

### 3. URL contract (proxy của host `router`)

Mỗi remote dùng `/<namespace>/assets/remoteEntry.js`: `/_workspace`, `/_workspace_2` (process), `/_end_user`, `/_subscription`, `/_sla`, `/_report_builder`, `/_chat`, `/_call_center`, `/_cgv_admin`, `/o` (root). Custom module dùng **20 slot** `/_cm_1` … `/_cm_20` → `remoteCm1..20/CustomApp`.

### 4. Shared dependencies

`react`, `react-dom`, `react-redux`, `@reduxjs/toolkit`, `react-router-dom`, `@tanstack/react-query`, `react-hook-form`, `yup`, `dayjs`. Template dùng đúng tập trên.
