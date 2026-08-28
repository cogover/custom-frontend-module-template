---
name: custom-module-i18n
description: Use when adding, changing, translating, moving, or deleting user-facing text, locale keys, namespaces, placeholders, or Trans content in custom-module-template.
---

# Custom Module i18n

Giữ toàn bộ bản dịch tự chứa trong custom module và đồng bộ giữa các locale được bundle cùng remote.

## 1. Local resources — bắt buộc

Mọi tài nguyên i18n phải nằm trong chính repo này:

```text
src/languages/locales/<locale>/<namespace>.json
```

Chỉ dùng cấu hình và hook nội bộ:

```tsx
import { useTranslation } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n';
```

Không đọc, tìm, cập nhật hoặc phụ thuộc vào:

1. Dự án `static`.
2. Locale của router hoặc remote Cogover khác.
3. URL `/static/locales/...`.
4. Hook/i18n instance do host cung cấp.
5. Tài nguyên dịch từ API bên ngoài.

Khi cần tái sử dụng key, chỉ search trong `src/languages/locales/` của custom module. Production và standalone phải dùng cùng bộ locale đã bundle trong remote.

## 2. Locale files

Locale mặc định của repo:

```text
src/languages/locales/
├── vi-VN/
│   └── app.json
└── en-US/
    └── app.json
```

Mỗi key mới phải được thêm đồng thời vào tiếng Việt và tiếng Anh. Không để locale này fallback sang nội dung của locale kia.

## 3. Namespace

1. Page thông thường dùng `I18nNS.APP`.
2. Chỉ tạo namespace mới khi nội dung đủ lớn và user đã duyệt.
3. Khi thêm namespace: cập nhật `I18nNS`, tạo file cho mọi locale và bảo đảm namespace nằm trong `namespaces`.

Good:

```tsx
const { t: tApp } = useTranslation(I18nNS.APP);
```

Bad:

```tsx
const { t } = useTranslation('unknown_namespace');
```

## 4. Hook sử dụng

1. Import `useTranslation` từ `src/languages/global`.
2. Import `Trans` từ `src/languages/global/Trans` khi nội dung có React element.
3. Không import trực tiếp từ `react-i18next` trong page/component.
4. Page không tự gọi `i18n.changeLanguage`; App/provider đồng bộ ngôn ngữ theo config hiện tại.

## 5. Prefix và key

1. Mỗi page/feature có prefix rõ ràng, ví dụ `welcomePage`.
2. Key tối đa hai cấp và dùng camelCase.
3. Không dùng nguyên câu làm key.

Good:

```text
welcomePage.title
requestList.emptyMessage
```

Bad:

```text
welcomePage.header.title
requestList.empty.message
welcomePage.motKhongGianDanhRiengChoYTuongCuaBan
```

## 6. Tái sử dụng key

1. Search locale nội bộ trước khi tạo key mới.
2. Dùng lại key khi cùng nghĩa và cùng ngữ cảnh.
3. Không mượn key của feature khác chỉ vì text hiện tại giống nhau nhưng ý nghĩa khác.
4. Không tìm key tương đồng ở repo bên ngoài.

## 7. Text thông thường

Locale:

```json
{
    "welcomePage": {
        "title": "Một không gian dành riêng cho ý tưởng của bạn"
    }
}
```

```json
{
    "welcomePage": {
        "title": "A space made for your ideas"
    }
}
```

JSX:

```tsx
const { t: tApp } = useTranslation(I18nNS.APP);

<h1>{tApp('welcomePage.title')}</h1>
```

Không hardcode text đã thuộc phạm vi i18n trong JSX.

## 8. Placeholder

Placeholder dùng cú pháp `{{name}}` và giữ cùng tên ở mọi locale:

```json
{
    "requestDetail": {
        "title": "Yêu cầu {{requestId}}"
    }
}
```

```tsx
tApp('requestDetail.title', { requestId });
```

Không dùng `{requestId}` hoặc `${requestId}` trong locale string.

## 9. Nội dung có React element

Dùng `Trans` nội bộ:

```tsx
<Trans
    ns={I18nNS.APP}
    i18nKey='welcomePage.description'
    components={{ 1: <strong /> }}
/>
```

Locale:

```json
{
    "welcomePage": {
        "description": "Xây dựng <1>trải nghiệm riêng</1> trên Cogover"
    }
}
```

Không dùng `dangerouslySetInnerHTML` để render bản dịch.

## 10. Quy tắc dịch

1. Giữ đúng nghĩa, dùng câu chủ động và sentence case.
2. Không dịch tên sản phẩm, mã kỹ thuật, URL hoặc placeholder.
3. Giữ nguyên `Cogover` và `Custom Page` khi đó là tên khái niệm trong sản phẩm.
4. Tên hành động phải nhất quán: `Lưu` → `Đã lưu`, `Save` → `Saved`.
5. Text lỗi phải nói rõ vấn đề và cách xử lý.

## 11. Xóa key

1. Search và xác nhận không còn call-site trước khi xóa.
2. Xóa key ở mọi locale trong cùng thay đổi.
3. Không giữ key của page/component đã bị xóa nếu không còn nơi sử dụng.

## 12. Verify locale

1. Chạy Prettier cho mọi JSON đã sửa.
2. Dùng `jq` xác nhận key nằm đúng prefix.
3. So sánh toàn bộ scalar path giữa các locale; diff phải trống.
4. Sau đó chạy lint, TypeScript và build.

```bash
jq '.welcomePage | has("title")' src/languages/locales/vi-VN/app.json

diff \
  <(jq -r '[paths(scalars)] | sort | .[] | join(".")' src/languages/locales/vi-VN/app.json) \
  <(jq -r '[paths(scalars)] | sort | .[] | join(".")' src/languages/locales/en-US/app.json)
```
