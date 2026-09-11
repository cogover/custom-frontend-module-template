# custom-module-template

Đọc tài liệu tiếng Anh [tại đây](README.md).

Dự án mẫu để phát triển Custom Module (phần mở rộng tùy chỉnh) cho Cogover. Bạn có thể sửa trang mẫu, thêm trang mới và gọi API của workspace đã chọn.

## Chạy dự án local

Yêu cầu Node.js và tài khoản có quyền truy cập workspace Cogover. Dự án đã được kiểm tra với Node.js `20.19.6`.

1. Clone dự án về máy.
2. Sao chép `.env.sample` thành `.env.local` và điền tên workspace. Ví dụ với `https://cong-ty.cogover.com`:

    ```dotenv
    VITE_WORKSPACE_NAME=cong-ty
    ```

3. Cài thư viện:

    ```bash
    npm ci
    ```

4. Chạy dự án ở môi trường local:

    ```bash
    npm run dev
    ```

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
