---
name: i18n-translation
description: >-
  Quy trình đa ngôn ngữ (i18n / dịch text) cho dự án custom-module-template (custom
  module remote của Cogover). LUÔN dùng skill này khi user muốn "dịch", "đa ngôn ngữ",
  "i18n", "thêm bản dịch", "thêm key ngôn ngữ", "tiếng Anh/tiếng Việt", "translate",
  hoặc đưa text cứng thành key dịch trong dự án này. Khác với các remote khác: resource
  KHÔNG nằm ở dự án `static` mà BUNDLE LOCAL ngay trong repo (src/languages/locales/),
  nên sửa bản dịch là sửa thẳng trong repo này.
---

# i18n trong custom-module-template

## Khác biệt cốt lõi với chuẩn Cogover

Các remote khác (end-user, sla, chat…) fetch bản dịch từ **dự án `static`**
(`build_docker/static/locales/<lng>/<ns>.json`). Dự án này thì **KHÔNG**: resource được
**tạo & bundle local** trong repo. `src/languages/i18n.ts` dùng `import.meta.glob('./locales/**/*.json')`
để tự nạp mọi file `src/languages/locales/<lng>/<ns>.json` thành resource lúc build.

➡️ **Hệ quả: sửa/ thêm bản dịch là sửa thẳng file JSON trong repo này.** Bỏ qua toàn bộ
thao tác với dự án `static` (không cần tìm dự án static, không check branch static, không
update file bên static).

## Mặc định: KHÔNG tự i18n

Text mới **mặc định viết tiếng Việt trực tiếp**, KHÔNG tách key i18n trừ khi user yêu cầu
rõ. Chỉ chạy quy trình dưới đây khi được yêu cầu "dịch" / "đa ngôn ngữ".

## Cấu trúc resource

```
src/languages/locales/
├── vi-VN/app.json      # namespace APP, tiếng Việt
└── en-US/app.json      # namespace APP, tiếng Anh
```

- Mỗi file `<lng>/<ns>.json` = resource của namespace `<ns>` cho ngôn ngữ `<lng>`.
- Thêm **ngôn ngữ** mới = thêm thư mục `<lng>/` + các file ns. Thêm **namespace** mới =
  thêm file `<ns>.json` ở mọi `<lng>/` (vd `common.json`). `i18n.ts` tự glob, không cần khai báo thêm.
- Namespace khai trong enum `I18nNS` (`src/languages/i18n.ts`): hiện có `APP = 'app'`,
  `COMMON = 'common'`. `defaultNS = APP`. Dùng namespace nào thì phải có file JSON tương ứng.

## Quy trình dịch

### 1. Xác định namespace + prefix
- **Namespace**: thường là `APP` (mặc định). `COMMON` cho text dùng chung nhiều nơi.
- **Prefix** (cấp 1 của key): gom theo page/khối, vd `helloPage`, `userPage`, `reportPage`.
- Quy tắc prefix đặc biệt cho **key MỚI**:
  - Text validate (lỗi form, required, min/max, sai định dạng…) → prefix `schema`.
  - Text thông báo (toast/alert báo thành công/thất bại…) → prefix `notification`.
  - Key cũ không theo rule này thì giữ nguyên.

### 2. Tra key dùng chung trước khi tạo mới
Nếu có `src/languages/locales/vi-VN/common.json`, mở ra tìm key nghĩa tương đồng
(`save`, `cancel`, `confirm`, `delete`, `edit`, `close`, `search`, `back`…) → **dùng lại**,
không tạo trùng. (Hiện repo mới chỉ có `app.json`; tạo `common.json` khi cần text dùng chung.)

### 3. Dùng trong code
Import theo đúng wrapper của dự án (KHÔNG import trực tiếp `react-i18next`):

```tsx
import { useTranslation } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n';

export default function ReportPage() {
    const { t } = useTranslation(I18nNS.APP);
    return <h2 className='prose-h5 text-typo-primary'>{t('reportPage.title')}</h2>;
}
```

- Đặt tên biến `t` theo namespace khi dùng nhiều ns: `tApp`, `tCommon`.
- Placeholder: `t('reportPage.greeting', { name })` với key `"Xin chào {{name}}"` → `"Hello {{name}}"`.
- HTML/template dùng `Trans`:

```tsx
import Trans from 'src/languages/global/Trans';

<Trans
    ns={I18nNS.APP}
    i18nKey='reportPage.boldText'
    components={{ 1: <strong />, 2: <em /> }}
    values={{ name }}
/>
```
> vi: `"Chữ <strong>đậm</strong>: <em>{{name}}</em>"` → en: `"<1>Bold</1> text: <2>{{name}}</2>"`.
> Số trong `components` khớp `<1>`, `<2>`… (bắt đầu từ 1).

### 4. Thêm bản dịch vào file JSON local
Sửa cả 2 (và mọi) locale: `src/languages/locales/vi-VN/<ns>.json` + `src/languages/locales/en-US/<ns>.json`.

- **key**: camelCase của text tiếng Anh, KHÔNG bao gồm prefix trong cột tên.
- **Tối đa 2 cấp**: `<prefix>.<name>`. TUYỆT ĐỐI không tạo cấp 3 (`a.b.c`) — cần ngữ cảnh thì
  gộp vào `<name>` bằng camelCase (`schema.emailRequired`, không phải `schema.email.required`).
- **Không trùng** full path `<prefix>.<key>` trong cùng namespace.
- Đặt key mới **gần các key cùng prefix** (đừng append mù vào cuối file — JSON lồng nhau,
  "cuối file" = cuối prefix cuối cùng, dễ nhét nhầm prefix).

### 5. Verify (bắt buộc trước khi xong)
```bash
# cú pháp JSON
npx prettier --write src/languages/locales/**/<ns>.json
# 2 locale phải cùng tập key (diff trống = OK)
diff <(jq -r '[paths(scalars)]|sort|.[]|join(".")' src/languages/locales/vi-VN/<ns>.json) \
     <(jq -r '[paths(scalars)]|sort|.[]|join(".")' src/languages/locales/en-US/<ns>.json)
```
Có dòng diff = thiếu key hoặc nhầm prefix ở 1 locale → fix tại chỗ, không commit khi còn lệch.

## Tuyệt đối KHÔNG
- KHÔNG tự i18n khi chưa được yêu cầu — mặc định text tiếng Việt trực tiếp.
- KHÔNG đụng tới dự án `static` — dự án này bundle resource local.
- KHÔNG import `useTranslation`/`Trans` trực tiếp từ `react-i18next` — dùng wrapper
  `src/languages/global` (có fallback `window.i18n` khi chạy trong host).
- KHÔNG tạo key cấp 3; KHÔNG để 2 locale lệch tập key; KHÔNG dùng `{name}` (phải `{{name}}`).
