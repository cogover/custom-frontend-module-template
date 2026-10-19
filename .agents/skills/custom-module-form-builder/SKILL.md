---
name: custom-module-form-builder
description: Use when creating or editing a federation component embedded in a Cogover Form Builder layout, declaring its expose path, receiving formBuilder props (execScript, refreshRecordDetail, record, mode, objectSlug), using execScript, reading the current record or screen mode, or refreshing the current record in custom-module-template.
---

# Custom Module Form Builder

Tạo component nhúng trong layout Form Builder, thao tác form bằng `formBuilder.execScript` và tải lại bản ghi hiện tại bằng `formBuilder.refreshRecordDetail`. Không áp dụng cho việc chỉ sửa trang CustomApp thông thường hoặc viết chuỗi script để dán vào cấu hình layout.

## 1. Kiểm tra code và kiểu có sẵn

1. Tìm component và cấu hình `exposes` hiện có trước khi tạo mới; sửa hoặc tái sử dụng phần phù hợp.
2. Kiểu hợp đồng nằm trong `@cogover/client-sdk` (mục "Module contract" trong README của gói): `FederationComponentProps`, `FederationFormBuilder`, `FormBuilderScript`, `FormBuilderScriptContext` và toàn bộ `screen`. [src/types/form-builder.d.ts](../../../src/types/form-builder.d.ts) chỉ re-export các kiểu này.
3. Đọc các khối `@example` ngay trên kiểu và phương thức liên quan (trong `node_modules/@cogover/client-sdk/dist/contract/formBuilder.d.ts`); không tạo bản sao tài liệu hoặc định nghĩa lại các kiểu này trong component.
4. Không dùng `any` hoặc cài thư viện khác để lấy API Form Builder. Chỉ dùng `import type` từ `@cogover/client-sdk`.
5. `formBuilder` có đúng 5 thành phần dưới đây, giống nhau trên web và trên ứng dụng mobile. Mọi thành phần khác của Form Builder không thuộc hợp đồng: không dùng, không ép kiểu để truy cập. Cần API chưa có thì yêu cầu đơn vị cung cấp nền tảng Cogover bổ sung vào hợp đồng.

    | Thành phần             | Ý nghĩa                                                                               | Có ở màn      |
    | ---------------------- | ------------------------------------------------------------------------------------- | ------------- |
    | `execScript(script)`   | Chạy script sửa form; `await` xong là đọc được giá trị mới. Không lưu form lên server | Tạo, Xem, Sửa |
    | `refreshRecordDetail?` | Tải lại bản ghi hiện tại, trả bản ghi mới hoặc `null`                                 | Xem, Sửa      |
    | `record`               | Giá trị bản ghi hiện tại, chỉ đọc, cập nhật khi form đổi; màn Tạo chưa có `id`        | Tạo, Xem, Sửa |
    | `mode`                 | `'create'` \| `'view'` \| `'edit'`                                                    | Tạo, Xem, Sửa |
    | `objectSlug`           | Slug object của bản ghi                                                               | Tạo, Xem, Sửa |

6. `screen` (danh sách trường, ẩn/hiện…) chỉ có trong callback của `execScript`; ngoài callback đọc dữ liệu bằng `record`, `mode`, `objectSlug`.

## 2. Xuất component cho Form Builder

1. Đặt component trong `src/components/` hoặc cấu trúc tương đương đã có. Component nhận `FederationComponentProps` và được xuất mặc định.
2. Đối chiếu đường dẫn host cần gọi trước khi thêm `exposes`. Quy ước đã thống nhất cho component trong Form Builder là:

    | Vị trí                    | Ví dụ                              |
    | ------------------------- | ---------------------------------- |
    | File component            | `src/components/PromotionCard.tsx` |
    | Khóa trong `exposes`      | `./Components/PromotionCard`       |
    | Path cấu hình trên layout | `_cm_1/Components/PromotionCard`   |

    `Components/` là quy ước tích hợp với Form Builder của Cogover, không phải yêu cầu bắt buộc của Module Federation. Tên và chữ hoa/thường phải khớp hợp đồng thực tế.

3. **Bắt buộc giữ nguyên mapping `'./CustomApp': './src/App.tsx'` trong `exposes` của `vite.config.ts`. Không được xóa, đổi khóa `./CustomApp` hoặc thay đổi đường dẫn `./src/App.tsx`.** Khi thêm component cho Form Builder, chỉ bổ sung khóa mới vào `exposes`.
4. Giữ `base: './'` trong Vite theo [custom-module-foundation](../custom-module-foundation/SKILL.md). Mục đích chính là để tài nguyên được Vite xử lý theo địa chỉ phục vụ remote (module được nhúng), không theo domain của trang host (ứng dụng chủ). Nếu host chuyển tiếp remote, dùng địa chỉ chuyển tiếp thực tế; không bắt buộc URL khác domain host. Cùng một bản build dùng được ở nhiều slot là lợi ích đi kèm.
5. `_cm_1` trong bảng chỉ là ví dụ slot được gán trên layout. Không ghi cố định `_cm_1` hoặc `/_cm_N/` vào URL ảnh, CSS, code component hay lệnh build. Dùng import tài nguyên theo skill foundation.
6. Khi build, mọi khóa `./Components/*` trong `exposes` tự được bọc `AppSlugProvider` (app slug lấy từ `useLibrary().appSlug`, request có `X-App-Slug`) và store riêng của module; component không tự bọc lại, chỉ thêm khóa vào `exposes` như bảng trên. Lớp bọc là function component nên component expose không nhận `ref` từ bên ngoài: không dựa vào `ref`/`forwardRef` ở cấp expose. Dữ liệu nền tảng đọc qua `useLibrary()`, không qua store. Không bọc component bằng CustomApp, bộ định tuyến riêng, header hoặc sidebar của ứng dụng chủ. Với thư viện có context dùng chung như client SDK, đối chiếu yêu cầu provider và cấu hình `shared` với tài liệu tích hợp Cogover trước khi sử dụng.
7. Chữ hiển thị dùng `useTranslation`/`Trans` của `src/languages/global` như page: i18n tự khởi tạo và theo ngôn ngữ của nền tảng dù component không đi qua `App`; không tự gọi `i18n.changeLanguage`. Xem [custom-module-i18n](../custom-module-i18n/SKILL.md).

## 3. Nhận formBuilder và gọi API

```ts
import type { FederationComponentProps, FormBuilderScript } from '@cogover/client-sdk';
```

1. Nhận `formBuilder` qua props của component. Dùng API qua prop này; không yêu cầu nền tảng truyền riêng `screen`.
2. Viết logic bằng hàm và truyền trực tiếp vào `execScript`:

    ```ts
    await formBuilder.execScript(async ({ screen }) => {
        // Logic TypeScript; dùng trực tiếp biến nghiệp vụ bên ngoài hàm.
    });
    ```

3. Không dùng `toString()`, nối chuỗi, `eval` hoặc `new Function` để chuyển hay chạy hàm. Kiểu hiện vẫn nhận chuỗi nhằm tương thích script cũ; component mới dùng hàm trực tiếp.
4. Nền tảng Cogover tạo `screen` cho mỗi lần thực thi và áp dụng thay đổi trường, bố cục. Component chỉ thao tác qua API được cung cấp, không thay thế luồng cập nhật form của nền tảng.
5. Nếu cần tách logic dùng lại, dùng `FormBuilderScript` hoặc `FormBuilderScriptContext` hiện có thay vì tự định nghĩa chữ ký mới.
6. Khi cần tải lại bản ghi hiện tại từ server, gọi API không tham số:

    ```ts
    if (!formBuilder.refreshRecordDetail) throw new Error('Không thể làm mới bản ghi.');
    const refreshedRecord = await formBuilder.refreshRecordDetail();
    if (!refreshedRecord) return;
    ```

7. Không truyền record ID vào `refreshRecordDetail`; host tự bind ID của bản ghi thuộc Form Builder hiện tại trước khi cung cấp API cho component.
8. Refresh cập nhật lại dữ liệu form theo bản ghi trên server. Chỉ gọi sau khi dữ liệu cần giữ đã được lưu, hoặc sau khi người dùng xác nhận bỏ thay đổi chưa lưu.

## 4. Điều khiển các thành phần

1. Dùng `screen.get(slug, componentType)` theo đúng kiểu thành phần; bỏ tham số thứ hai tương đương `FORM_ITEM`. Kiểm tra kết quả `null` trước khi sử dụng.
2. Trường thường dùng `ScreenFormItem`; nhóm bố cục dùng `ScreenContainer`; Path Component dùng `ScreenPathComponent`; bảng liên quan dùng `ScreenRelatedList` và các kiểu dòng/ô/cột. Đọc `@example` của đúng kiểu trước khi sửa thuộc tính.
3. `value` là `unknown`: kiểm tra kiểu theo dữ liệu thực tế trước khi tính toán hoặc đọc thuộc tính con. Không mặc định giá trị lookup luôn là object hay luôn là mảng.
4. Các hàm bảng như `rows`, `row`, `getRow`, `getCol`, `findRow`, `setData`, `submit` là tùy chọn. Kiểm tra trước khi gọi và `await` những hàm trả Promise.
5. Không giữ `screen`, dòng hoặc ô vào biến module, state hay ref để thao tác sau lần thực thi. Không đặt việc sửa form vào setTimeout rồi để callback kết thúc trước.
6. Gọi từ sự kiện người dùng theo mặc định. Chỉ tự động chạy khi nghiệp vụ yêu cầu; khi đó xác định điều kiện kích hoạt, tránh lặp cập nhật và ghi đè giá trị người dùng đã nhập.
7. Nếu có API nghiệp vụ, dùng [custom-module-api](../custom-module-api/SKILL.md), đợi kết quả và kiểm tra dữ liệu xong rồi mới sửa form. Không gắn mã record, field hoặc layout của một ví dụ thành quy tắc chung.

## 5. Kết quả và lỗi

1. Kiểm tra `formBuilder` có được truyền không (component có thể render ngoài form) và `formBuilder.refreshRecordDetail` (không có ở màn Tạo, `mode === 'create'`) trước khi thao tác; vô hiệu hóa nút hoặc hiển thị trạng thái phù hợp khi không có.
2. Bắt lỗi tại component và chỉ báo thành công sau khi API hoàn tất. Không nuốt lỗi hoặc báo đã áp dụng khi hàm chưa được gọi.
3. Sửa giá trị ô bảng đi qua API bảng ngay. Nếu lỗi giữa chừng, không có cơ chế tự hoàn tác toàn bộ các ô đã sửa.
4. Chạy script thành công không đồng nghĩa đã lưu record lên server. `submit()` lưu bảng liên quan, không phải toàn bộ form cha; chỉ gọi khi nghiệp vụ yêu cầu lưu.
5. `screen.changeLayout` và `screen.triggerButton` trả void. Không dùng await để giả định việc chuyển layout hay toàn bộ hành động của nút đã hoàn tất.

## 6. Kiểm tra trước khi bàn giao

1. Kiểm tra đường dẫn expose, file đích và chữ hoa/thường khớp với đường dẫn được cấu hình trên Form Builder.
2. Chạy Prettier, ESLint và TypeScript cho phần thay đổi; kiểm tra dependencies của hook nếu có.
3. Kiểm thử hành vi có sửa: thiếu API/thành phần, cập nhật trường hoặc ô, refresh bản ghi và lỗi được trả về component. Không dùng mock để thay thế chính luồng cập nhật đang cần xác nhận.
4. Build theo yêu cầu của người dùng. Nếu được yêu cầu không build, không chạy build; báo rõ phạm vi đã kiểm tra. Khi build, dùng cấu hình relative base của foundation, không thêm slot cố định.
5. Nếu bản triển khai báo không tìm thấy remote module, đối chiếu `remoteEntry.js` đang được phục vụ với cấu hình source; không kết luận source sai chỉ vì bản triển khai cũ.
