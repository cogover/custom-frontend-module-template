# CLAUDE.md

File này cung cấp hướng dẫn cho Claude Code khi làm việc với repository `custom-module-template`.

## Project Overview

`custom-module-template` là **skeleton/template để tạo 1 Custom Module** trong hệ Module Federation Cogover — một **remote** chỉ expose đúng 1 component `./CustomApp` (`src/App.tsx`), được nền tảng Cogover nhúng tại vị trí dành cho Custom Module.

-   Federation `name: 'customModule'`, `exposes: { './CustomApp': './src/App.tsx' }`, `remotes` rỗng (không tiêu thụ remote nào). Cấu hình nằm trong `vite.config.ts`.
-   `App.tsx` chỉ tự bọc `AppSlugProvider`; Redux, ngữ cảnh điều hướng và bố cục trang do nền tảng Cogover cung cấp. Các provider còn lại chỉ phục vụ **chế độ dev standalone**.
-   Routing dùng **path TƯƠNG ĐỐI** (không leading slash) vì nền tảng Cogover quản lý phần đường dẫn bên ngoài module.
-   Đã loại bỏ FontAwesome khỏi code dự án; eslint chặn cứng import `@fortawesome/*`.

## Chọn workspace khi chạy trên máy

1. Sao chép `.env.sample` thành `.env.local`, điền tên workspace:

    ```dotenv
    VITE_WORKSPACE_NAME=cong-ty
    ```

2. Chạy `npm ci`, sau đó `npm run dev`. Truy cập `https://localhost:5100`; không cần sửa file hosts. Chấp nhận chứng chỉ HTTPS tự ký của máy phát triển khi trình duyệt yêu cầu.
3. Các yêu cầu API, file và kết nối thời gian thực được chuyển tới `https://cong-ty.cogover.com`. Khi đổi workspace, khởi động lại máy chủ phát triển và tải lại trang. Phiên đăng nhập trên localhost được tách riêng theo workspace.
4. Khi chưa đăng nhập, trang tự chuyển đến trang đăng nhập Cogover và quay lại localhost sau khi xác thực. Token nhận qua URL được dùng để thiết lập phiên rồi xóa khỏi URL; nội dung module chỉ hiển thị sau khi có tài khoản và cấu hình hợp lệ.

Cấu hình workspace chỉ phục vụ chạy trên máy; khi được nhúng vào Cogover, module dùng môi trường của nền tảng.

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

-   **Xuất cho nền tảng Cogover**: chỉ `App.tsx` (qua `./CustomApp`). App dùng `AppSlugProvider` và `APP_ROUTES`.
-   Nền tảng Cogover truyền prop `appSlug` (định danh ứng dụng trong URL); `AppSlugProvider` phân phối giá trị này qua `useAppSlug()`.
-   Chế độ standalone/dev không có app slug; `useAppSlug()` trả chuỗi rỗng.
-   **Dev-only**: `main.tsx`, `MainProvider`, `DevConfigGate`; standalone render thẳng nội dung page.

### Thêm page mới

Sửa **chỉ** `src/routes.tsx`: thêm entry vào `APP_ROUTES`; `App.tsx` tự map ra `<Routes>`.

## i18n (đa ngôn ngữ)

Khi làm việc với bản dịch, tuân theo [skill custom-module-i18n](.agents/skills/custom-module-i18n/SKILL.md): dùng tài nguyên dịch trong repo và các import, namespace, quy tắc kiểm tra được hướng dẫn tại đó. Mặc định text mới viết tiếng Việt trực tiếp, không tự triển khai đa ngôn ngữ khi chưa được yêu cầu.

## Địa chỉ tài nguyên tĩnh của remote

`base: './'` giúp tài nguyên được Vite xử lý theo địa chỉ phục vụ remote (module được nhúng), thay vì theo domain của trang host (ứng dụng chủ). Với tài nguyên tham chiếu từ JavaScript, Vite dựa vào `import.meta.url` của file JavaScript remote; URL tương đối trong CSS được tính theo file CSS đang tải.

1. Remote khác domain host: host ở `https://app.example.com`, file JavaScript remote ở `https://remote.example.com/assets/page.js` thì ảnh được build thành `banner-HASH.png` trong cùng thư mục phải tải từ `https://remote.example.com/assets/banner-HASH.png`, không phải `https://app.example.com/assets/banner-HASH.png`.
2. Remote được host chuyển tiếp: file JavaScript tải từ `https://app.example.com/_cm_1/assets/page.js` thì ảnh theo `https://app.example.com/_cm_1/assets/banner-HASH.png`. Domain có thể trùng host nhưng đường dẫn phải phục vụ đúng remote.

Đặt ảnh, video, audio, font và file tải xuống trong `src/assets`, import URL trong TypeScript/TSX; CSS dùng `url(...)` tương đối tới file nguồn. `base: './'` không tự sửa chuỗi URL viết trực tiếp như `/images/banner.png` trong JSX — đường dẫn đó vẫn trỏ về domain host.

Dùng cùng một bản build ở nhiều slot là lợi ích đi kèm. Không bắt buộc URL tài nguyên khác domain host hoặc luôn có tiền tố `/_cm_N/`; phải khớp địa chỉ thực tế phục vụ remote. Chi tiết xem [custom-module-foundation](.agents/skills/custom-module-foundation/SKILL.md#9-static-asset--critical).

## Convention chính

-   Styling: design token (`text-typo-primary`, `bg-background-default`, `border-divider-primary`…), spacing `rem`, typography `prose-*`, gom class bằng `cx` (`src/utils/cx`).
-   CẤM import `@fortawesome/*` (eslint error). Khi cần icon, dùng asset SVG thuộc dự án.
-   **Bắt buộc** dùng component `Link` nội bộ cho liên kết điều hướng trong cả page và chế độ dev: `import Link from 'src/components/Link';`. Không import `Link` trực tiếp từ `react-router-dom`, không dùng `<a href>` cho điều hướng nội bộ và không tự nối app slug (định danh ứng dụng trong URL); component `Link` xử lý phần này.
-   `npm run build` = `tsc && vite build`; eslint chỉ chạy lúc `serve` (gate trong `vite.config.ts`), build dùng `npm run lint` riêng.
