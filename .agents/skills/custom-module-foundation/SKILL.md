---
name: custom-module-foundation
description: Use when changing architecture, routing, Link navigation, providers, Module Federation, theme, Vite base, images, video, audio, fonts, downloads, static assets, shared UI foundations, or UI components and icons from @cogover/client-sdk (FormControlLabel with Checkbox/Radio/Switch, MultipleSelect loading, Tag delete states, PopperMenu, SDK icons) in custom-module-template.
---

# Custom Module Foundation

Giữ custom module tương thích với nền tảng Cogover và chạy ổn định ở cả production lẫn standalone.

## 1. Component expose

1. **Bắt buộc giữ nguyên mapping `'./CustomApp': './src/App.tsx'` trong `exposes` của `vite.config.ts`. Không được xóa, đổi khóa `./CustomApp` hoặc thay đổi đường dẫn `./src/App.tsx`, kể cả khi chỉ phát triển component cho Form Builder.**
2. Giữ nguyên federation name, filename và expose key hiện tại.
3. Chỉ thêm expose mới sau khi user duyệt contract với nền tảng Cogover.

## 2. Tích hợp với nền tảng Cogover

1. Nền tảng Cogover quản lý phần đường dẫn ứng dụng và vị trí Custom Module bên ngoài module.
2. Nền tảng Cogover truyền `appSlug` vào `CustomApp` qua prop.
3. `AppSlugProvider` phân phối prop đó; component con đọc bằng `useAppSlug()`.
4. Standalone không có app slug; context trả chuỗi rỗng.

## 3. Điều hướng trong module

1. Không khai báo `:appSlug` hoặc `cN` trong cấu hình đường dẫn của custom module; nền tảng Cogover đã quản lý hai segment này.
2. Khai báo mọi route tại `src/routes.tsx`; `App.tsx` chỉ map `APP_ROUTES` thành `<Route>`. Route có `name` hiện trên sidebar của layout dev (kèm `icon` nếu có); route có tham số (`customers/:customerId`) bỏ trống `name`.
3. Path của page luôn tương đối.

Good:

```tsx
{
    key: 'request-detail',
    path: 'requests/:requestId',
    element: <RequestDetailPage />,
}
```

Bad:

```tsx
{
    path: ':appSlug/c1/requests/:requestId',
    element: <RequestDetailPage />,
}
```

## 4. Link nội bộ — bắt buộc

Mọi link được viết trong custom module phải dùng component của dự án:

```tsx
import Link from 'src/components/Link';

<Link to='/records'>Danh sách bản ghi</Link>;
```

`to` luôn bắt đầu bằng `/` và tính từ gốc module, kể cả link có tham số: `to={`/records/${record.id}`}`. Path không có `/` đầu là path tương đối, sẽ nối vào route hiện tại (standalone ra `/records/records/…`).

`Link` nội bộ chịu trách nhiệm gắn app slug ở production, giữ nguyên path ở standalone, tránh slug lặp và tránh URL dạng `//user`.

Không import trực tiếp từ React Router:

```tsx
import { Link } from 'react-router-dom';

<Link to='/records'>Danh sách bản ghi</Link>;
```

URL trên có thể thiếu app slug, khiến nền tảng Cogover redirect lại và giao diện nháy một lần.

Không tự nối app slug:

```tsx
const appSlug = useAppSlug();

<Link to={`/${appSlug}/records`}>Danh sách bản ghi</Link>;
```

Cách này có thể tạo `//records` ở standalone hoặc gắn slug hai lần ở production.

Không dùng `<a href>` cho điều hướng nội bộ vì sẽ reload toàn trang và tải lại federation.

## 5. Provider

1. Production dùng Redux, Router context và `LibraryProvider` của `@cogover/client-sdk` do host cung cấp.
2. Standalone dùng `MainProvider` và `DevConfigGate`; `MainProvider` có `ClientSdkProvider` cấp `LibraryProvider` từ dữ liệu workspace trong Redux.
3. Không bọc `LibraryProvider` trong `App.tsx` hay component expose.
4. Provider nội bộ chỉ giữ dữ liệu custom module thực sự cần.
5. Page và `App.tsx` không dựng header, sidebar hoặc layout của host. Standalone đã có layout dev `src/dev/layout` (header 56px, sidebar 60/240px, đặt `--top-toolbar-width`/`--left-toolbar-width` như Cogover): page tính chiều cao theo `calc(100svh-var(--top-toolbar-width))`, không viết nhánh riêng cho standalone.

## 6. Module Federation

1. Giữ React, React DOM, Redux, React Router và `@cogover/client-sdk` trong `shared`.
2. Trước khi thay đổi cấu hình Module Federation, đối chiếu với yêu cầu tích hợp Custom Module của Cogover; nếu chưa rõ, yêu cầu thông tin từ đơn vị cung cấp nền tảng.
3. Dùng import tường minh khi federation plugin yêu cầu string literal.

## 7. Theme và global style

1. Dùng variables trong `src/theme/variables.scss`.
2. Background dùng `--background-default`; text dùng `--typography-primary`.
3. Font dùng `var(--font, 'Nunito Variable')` và package `@fontsource-variable/nunito`.
4. Giữ các quy tắc CSS toàn cục tương thích với giao diện Cogover.
5. Page phải hiển thị đúng ở cả light và dark theme.

## 8. UI convention nền tảng

1. Màu lấy từ design token trong `tailwind.config.js`.
2. Spacing và kích thước dùng `rem`.
3. Font size, weight và line-height dùng class `prose-*`.
4. Ghép class bằng `cx()` và nhóm theo layout, spacing, visual, typography, interaction. Class có điều kiện dùng object `{ 'text-typo-secondary': secondary }`, không dùng toán tử `? :` hay nối chuỗi trong `cx()`.
5. Không hardcode giá trị khi dự án đã có token tương ứng.

## 9. Static asset — CRITICAL

Áp dụng phần này cho mọi tài nguyên tĩnh của custom module: image, SVG, video, audio, font, file download, `poster`, `<source>` và CSS `url(...)`. Asset có thể chạy đúng ở standalone nhưng trỏ nhầm sang nền tảng Cogover nếu build tạo URL bắt đầu bằng `/`.

### Resolve tài nguyên theo địa chỉ phục vụ remote

1. Giữ `base: './'` trong `vite.config.ts`.
2. Chỉ build bằng `npm run build`.
3. Không truyền `--base=/_cm_N/`, không hardcode `_cm_1`, `_cm_2` hoặc bất kỳ slot nào vào source hay config build.

`base: './'` giúp tài nguyên được Vite xử lý theo địa chỉ phục vụ remote (module được nhúng), thay vì theo domain của trang host (ứng dụng chủ). Với tài nguyên tham chiếu từ JavaScript, Vite dựa vào `import.meta.url` của file JavaScript remote; URL tương đối trong CSS được tính theo file CSS đang tải.

1. Remote khác domain host: host ở `https://app.example.com`, file JavaScript remote ở `https://remote.example.com/assets/page.js` thì ảnh được build thành `banner-HASH.png` trong cùng thư mục phải tải từ `https://remote.example.com/assets/banner-HASH.png`, không phải `https://app.example.com/assets/banner-HASH.png`.
2. Remote được host chuyển tiếp: file JavaScript tải từ `https://app.example.com/_cm_1/assets/page.js` thì ảnh theo `https://app.example.com/_cm_1/assets/banner-HASH.png`. Domain có thể trùng host nhưng đường dẫn phải phục vụ đúng remote.

`base: './'` không tự sửa chuỗi URL viết trực tiếp trong JSX như `/images/banner.png`. Phải để Vite xử lý tài nguyên qua import hoặc CSS như hướng dẫn dưới đây. Dùng cùng bản build ở nhiều slot là lợi ích đi kèm.

### Asset dùng trong TypeScript/TSX

Đặt file trong `src/assets` và import URL tường minh để Vite emit file, thêm hash và giữ quan hệ tương đối với chunk:

```tsx
import audioUrl from 'src/assets/notification.mp3';
import bannerUrl from 'src/assets/banner.png';
import demoVideoUrl from 'src/assets/demo.mp4';

<img src={bannerUrl} alt='Banner giới thiệu' />;
<video src={demoVideoUrl} poster={bannerUrl} controls />;
<audio src={audioUrl} controls />;
```

Với lựa chọn asset động, tạo map từ các import tường minh. Không ghép path bằng template string vì Vite có thể không phân tích và emit đủ file.

### Asset dùng trong CSS/SCSS và HTML

1. Trong CSS/SCSS thuộc `src`, dùng `url(...)` tương đối tới file trong `src/assets`; Vite sẽ xử lý URL khi build.
2. Trong `index.html`, tham chiếu `/src/assets/...`; Vite sẽ chuyển thành URL build. `index.html` của remote không được nền tảng Cogover sử dụng khi load Module Federation.

### Không dùng

1. Không dùng hoặc tạo thư mục `public` cho asset của custom module.
2. Không viết root-relative URL như `/assets/file.mp4`, `/images/banner.png` hoặc `url('/fonts/font.woff2')`; browser sẽ request public root của nền tảng Cogover.
3. Không tự nối origin, app slug hoặc `/_cm_N/` vào URL asset.

URL đầy đủ nhận từ API hoặc CDN là runtime resource, không phải build asset; dùng nguyên URL đó và không thêm tiền tố đường dẫn ứng dụng.

### Verification bắt buộc

1. Chạy đúng `npm run build`, không thêm `--base`.
2. Kiểm tra asset local đã được emit vào `dist/assets` và output không chứa URL root-relative `/assets/...` cho asset đó.
3. Khi có môi trường chạy qua host, kiểm tra URL thực tế của tài nguyên khớp địa chỉ phục vụ remote, request trả `200` và nội dung hiển thị/phát được. Nếu remote khác domain host, tài nguyên phải theo domain remote; nếu host chuyển tiếp remote, tài nguyên phải theo đường dẫn chuyển tiếp. Chỉ yêu cầu `/_cm_N/assets/` khi đó là đường dẫn triển khai thực tế, không áp dụng cho mọi môi trường.

## 10. Component giao diện từ `@cogover/client-sdk`

1. Import component từ `@cogover/client-sdk/ui`; không copy code component vào module, không tự dựng lại control SDK đã có.
2. Component đọc ngôn ngữ, theme và workspace từ `LibraryProvider` (mục 5); không truyền các cấu hình này vào từng component.
3. Bộ lọc bản ghi dùng `FilterGenerator`, xem skill `custom-module-api` mục 13.
4. Icon dùng bộ icon của SDK (`InfoCircleIcon`, `SlidersIcon`, `EllipsisVerticalIcon`, `ChevronDownIcon`, `SortIcon`, `FilterIcon`, `PlusIcon`, `EyeIcon`, `CopyIcon`, `PencilIcon`, `TrashIcon`…, danh sách đủ trong README của package). Icon kế thừa màu chữ (`currentColor`), cỡ qua prop `fontSize` (px). Chỉ tự vẽ SVG khi SDK chưa có.
5. Menu thả xuống dùng `PopperButton` (nút mở menu), `GroupDropdownButton` (nút tách) hoặc `Popper` + `PopperMenu` + `PopperMenuItem`; mục có class `hide-on-click` tự đóng menu. Không tự dựng dropdown bằng `div` định vị tuyệt đối.
6. Màn danh sách (header, bảng, phân trang, panel lọc) làm theo skill `custom-module-list-page`.

### Label cho Checkbox, Radio, Switch — dùng `FormControlLabel`

Good:

```tsx
import { FormControlLabel, Switch } from '@cogover/client-sdk/ui';

<FormControlLabel
    label='Nhận thông báo'
    control={<Switch checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />}
/>;
```

Bad:

```tsx
<label>
    <Switch checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
    Nhận thông báo
</label>
```

Cách bad làm Switch đổi trạng thái hai lần mỗi lần bấm: Switch tự click input, rồi thẻ `<label>` bọc ngoài click thêm lần nữa, nên công tắc trông như không bật được.

Rules:

1. Truyền control qua prop `control`, không truyền qua children.
2. `FormControlLabel` tự tạo `id` cho control và gắn `htmlFor` cho label; chỉ tự đặt `id` khi nơi khác cần tham chiếu control.
3. `disabled` của `FormControlLabel` khóa cả control lẫn màu label; không truyền `disabled` ở hai nơi.
4. Đổi vị trí label bằng `labelPlacement` (`right` mặc định, `left`, `top`, `bottom`) và `labelAlign`; không tự dựng flex quanh control.
5. Control không nhận `id` thì đặt `usingHtmlFor={false}`.

### Trạng thái đang tải của `MultipleSelect`

```tsx
<MultipleSelect
    fullWidth
    loading={isResolvingValue}
    optionListLoading={isFetchingOptions}
    options={departments}
    value={selected}
    getLabel={(department) => department.name}
    getValue={(department) => department.id}
    onChange={setSelected}
/>
```

Rules:

1. `loading` hiện spinner trong ô nhập khi giá trị đang được xử lý (ví dụ đang xác định hoặc kiểm tra lựa chọn); tag đã chọn và nút xóa vẫn giữ nguyên.
2. `optionListLoading` dành cho lúc danh sách lựa chọn đang tải.
3. Không tự đặt `Spinner` chồng lên `MultipleSelect`, không `disabled` control chỉ để báo đang tải.
4. Không truyền `loading` thì component giữ hành vi cũ (mặc định `false`).

### Tag không cho xóa

```tsx
<Tag
    onDelete={() => removeDepartment(department.id)}
    deleteDisabled={department.hasPositions}
    deleteTooltip='Phòng ban đang có nhân sự giữ vị trí'
>
    {department.name}
</Tag>
```

Rules:

1. Cần giữ nút xóa nhưng chặn thao tác thì dùng `deleteDisabled`; khi đó `onDelete` không được gọi.
2. Luôn kèm `deleteTooltip` nói rõ lý do bị khóa.
3. Không cho xóa và không cần giải thích thì bỏ `onDelete` hoặc đặt `showDeleteIcon={false}`.
4. Không tự chặn trong `onDelete` bằng `if` rồi im lặng bỏ qua; người dùng sẽ không biết vì sao bấm không có tác dụng.
