# custom-module-template

Đọc tài liệu tiếng Anh [tại đây](README.md).

Dự án mẫu để phát triển Custom Module (phần mở rộng tùy chỉnh) cho Cogover. Bạn có thể sửa trang mẫu, thêm trang mới và gọi API của workspace đã chọn.

## Chạy dự án local

Yêu cầu Node.js và tài khoản có quyền truy cập workspace Cogover. Dự án đã được kiểm tra với Node.js `20.19.6`.

1. Clone dự án về máy.
2. Sao chép `.env.sample` thành `.env.local` và điền tên workspace. Ví dụ với `https://company.cogover.com`:

    ```dotenv
    VITE_WORKSPACE_NAME=company
    ```

3. Cài thư viện:

    ```bash
    npm ci
    ```

4. Chạy dự án ở môi trường local:

    ```bash
    npm run dev
    ```

## Phát triển Custom Page

Tham khảo skill [custom-module-foundation](.agents/skills/custom-module-foundation/SKILL.md) trong dự án để phát triển Custom Page.

**Bắt buộc giữ nguyên mapping (ánh xạ) `'./CustomApp': './src/App.tsx'` trong `exposes` của `vite.config.ts`. Không được xóa, đổi khóa `./CustomApp` hoặc thay đổi đường dẫn `./src/App.tsx`, kể cả khi chỉ phát triển component cho Form Builder.**

## Phát triển component local trong Form Builder

Tham khảo skill [custom-module-form-builder](.agents/skills/custom-module-form-builder/SKILL.md) trong dự án để phát triển component cho Form Builder.

Sau khi cài thư viện và cấu hình workspace ở trên, dùng cách này để thử component (thành phần giao diện) trực tiếp trên trang Cogover.

1. Chạy lệnh theo dõi thay đổi và tự tạo lại bản build:

    ```bash
    npm run build-watch
    ```

2. Đợi bản build đầu tiên hoàn tất, mở terminal khác và chạy:

    ```bash
    npm run preview
    ```

    Giữ cả hai lệnh chạy trong lúc phát triển.

3. Trong terminal chạy `npm run preview`, tìm `Components/DemoCounter` dưới mục **Federation components:**:

    ```text
    Federation components:
    Components/DemoCounter
         -> http://localhost:5101/#./Components/DemoCounter
    ```

    Sao chép toàn bộ URL sau dấu `->`. Trong **cấu hình layout của Object**, chọn **Federation component** và điền vào trường **URL**. Chỉ dùng đường dẫn localhost này khi debug (kiểm tra, sửa lỗi) trên máy local.

4. Mở trang xem trước của Form Builder. Nếu trình duyệt hỏi quyền **“Truy cập các ứng dụng và dịch vụ khác trên thiết bị này”**, chọn **Cho phép** để trang Cogover tải component từ máy của bạn.
5. Sửa `src/components/DemoCounter.tsx`, lưu và đợi build thành công để xem phiên bản mới trên Form Builder.
6. Sau khi hoàn tất và triển khai bản build mới lên Cogover, **thay URL localhost trong cấu hình layout bằng đường dẫn triển khai thực tế** theo skill [custom-module-form-builder](.agents/skills/custom-module-form-builder/SKILL.md#2-xuất-component-cho-form-builder). Ví dụ với demo được triển khai ở vị trí `_cm_1`: `_cm_1/Components/DemoCounter`. Dùng đúng vị trí được cấp cho module của bạn.

## Các file thường dùng khi phát triển

1. `src/pages/WelcomePage/index.tsx`: trang mẫu để bắt đầu chỉnh sửa giao diện.
2. `src/pages/`: nơi đặt các trang mới.
3. `src/routes.tsx`: khai báo đường dẫn và trang tương ứng trong `APP_ROUTES`.
4. `src/components/`: các thành phần giao diện dùng chung, gồm `Link` và `Avatar`.
5. `src/apis/`: các hàm gọi API và kiểu dữ liệu liên quan.
6. `src/assets/`: ảnh, video, âm thanh và file tải xuống.
7. `src/languages/locales/`: các file bản dịch.

### Thêm trang mới

Tạo trang trong `src/pages/`, sau đó thêm trang vào `APP_ROUTES` tại `src/routes.tsx`. Đường dẫn khai báo không có dấu `/` ở đầu, ví dụ `customers` hoặc `customers/:customerId`.

### Liên kết giữa các trang

Bắt buộc dùng `Link` có sẵn trong dự án:

```tsx
import Link from 'src/components/Link';
```

Component này xử lý đường dẫn ứng dụng khi chạy trên Cogover. Không import `Link` trực tiếp từ `react-router-dom`, không tự ghép định danh ứng dụng vào URL và không dùng thẻ `<a>` để chuyển trang bên trong module.

### Ảnh, video và các file khác

Đặt tài nguyên trong `src/assets` và import khi sử dụng. Ví dụ:

```tsx
import logoUrl from 'src/assets/cogover-logo.svg';

<img src={logoUrl} alt='Cogover' />;
```

Giữ `base: './'` trong `vite.config.ts` để tài nguyên được tải theo địa chỉ phục vụ module. Không viết trực tiếp đường dẫn như `/images/banner.png` trong giao diện vì có thể tải sai địa chỉ khi module được nhúng vào Cogover. Xem thêm [hướng dẫn tài nguyên tĩnh](.agents/skills/custom-module-foundation/SKILL.md#9-static-asset--critical).

### Bản dịch

Khi cần giao diện đa ngôn ngữ, làm theo [hướng dẫn custom-module-i18n](.agents/skills/custom-module-i18n/SKILL.md) trong dự án. Mặc định nội dung mới viết bằng tiếng Việt; chỉ bổ sung bản dịch khi có yêu cầu.

### Quy tắc giao diện

1. Dùng màu, khoảng cách và kiểu chữ có sẵn theo [hướng dẫn custom-module-foundation](.agents/skills/custom-module-foundation/SKILL.md).
2. Chạy `npm run lint` để kiểm tra lỗi mã nguồn sau khi chỉnh sửa.
