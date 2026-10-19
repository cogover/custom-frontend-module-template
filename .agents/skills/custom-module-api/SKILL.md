---
name: custom-module-api
description: Use when adding or changing API clients, endpoints, request types, TanStack Query hooks, mutations, query keys, RPC headers, retries, API error handling, record filters built with FilterGenerator and useRecords, or receiving Custom Backend Module push messages (refreshRecords, toast, message) with useSocketListener from @cogover/client-sdk in custom-module-template.
---

# Custom Module API

Thêm API theo đúng HTTP infrastructure của custom module để cùng code chạy được trong nền tảng Cogover và standalone.

## 1. HTTP client chung

1. Dùng client tại `src/apis/apiBase.ts` cho mọi request.
2. Không tạo `axios.create()` hoặc gọi `fetch()` trực tiếp trong feature.
3. Client chung chịu trách nhiệm cho base URL tương đối, timeout, credentials, CSRF, request ID, app slug và retry production.

Good:

```tsx
import http, { SuccessResponse } from 'src/apis/apiBase';

return http.get<SuccessResponse<Customer[]>>('/api/v1/customers');
```

Bad:

```tsx
const client = axios.create({ baseURL: 'https://example.cogover.com' });
return client.get('/api/v1/customers');
```

Cách bad bỏ qua proxy, credentials và interceptor của dự án.

## 2. Cấu trúc theo domain

Đặt API và type cạnh nhau:

```text
src/apis/request/
├── request.api.ts
└── request.type.ts
```

1. `.api.ts` chứa URI, endpoint và query-key factory của domain.
2. `.type.ts` chứa params, payload và response data.
3. Không khai báo API type rải rác trong page/component.

## 3. URI và endpoint

Gom URI theo domain:

```tsx
const URI = '/api/v1/requests';

export const requestURI = {
    index: URI,
    detail: (requestId: string) => `${URI}/${requestId}`,
};
```

1. Không hardcode domain/workspace origin.
2. Path phải chạy qua Vite proxy ở standalone và cùng origin ở nền tảng Cogover.
3. Không đặt URL endpoint trực tiếp trong component.

## 4. Type response

Dùng type nền tảng hiện có:

1. `SuccessResponse<Data, Meta>`
2. `SuccessServiceResponse<Data, Meta>`: chỉ cho proxy cũ `REQUEST_TYPE.REVERSE_PROXY` (mục 6).
3. `ErrorApiResponse<Data>`

Route của Custom Backend Module (mục 6) trả đúng JSON do handler trả về: khai báo type theo contract của route, không
bọc trong `SuccessResponse`/`SuccessServiceResponse` nếu handler không trả shape đó.

```tsx
export interface RequestRecord {
    id: string;
    status: number;
    title: string;
}

getDetail(requestId: string) {
    return http.get<SuccessResponse<RequestRecord>>(requestURI.detail(requestId));
}
```

Không dùng `any` hoặc cast response sang type server không đảm bảo.

## 5. Params và payload

1. Tách rõ path params, query params, request body và Axios config.
2. Payload có cấu trúc phải có interface riêng.
3. Không gửi nguyên form state nếu server chỉ nhận một phần field.

```tsx
export interface UpdateRequestPayload {
    status: number;
    title: string;
}

update(requestId: string, payload: UpdateRequestPayload) {
    return http.put<SuccessResponse<RequestRecord>>(requestURI.detail(requestId), payload);
}
```

## 6. Service RPC

1. Dùng `createServiceHeader` với hằng `REQUEST_TYPE` trong `src/utils/apiUtils.ts` cho endpoint RPC.
2. Không hardcode `x-req-service` hoặc `x-req-type` tại call-site.

### Custom Backend Module

Route của Custom Backend Module (`/api/v1/ts-projects/{projectSlug}/...`) dùng `service: 3` và
`REQUEST_TYPE.TS_PROJECT` (`x-req-type: 9`). Response là nguyên HTTP status, header và body do handler trả, không bọc
`body`:

```tsx
const URI = '/api/v1/ts-projects/order_automation';

export const orderURI = {
    list: `${URI}/orders/list`,
};

export const orderApi = {
    list(params: OrderListParams) {
        return http.post<OrderListResult>(orderURI.list, params, {
            headers: createServiceHeader({ service: 3, type: REQUEST_TYPE.TS_PROJECT }),
        });
    },
};

// response.data chính là OrderListResult
```

Rules:

1. Không dùng `SuccessServiceResponse` và không đọc `response.data.body`: kết quả nghiệp vụ có thể có field `body` riêng.
2. Lỗi: kiểm tra `error.response.status` cùng `code`/`msg` trong `error.response.data`. `isProxyError(error)` là `true`
   khi Authorization Server trả lỗi thay backend (phiên hết hạn, định tuyến, backend không phản hồi); body khi đó là
   `{ r, msg }`.
3. Thao tác ghi gửi header nghiệp vụ `Idempotency-Key` riêng cho từng thao tác, giữ nguyên key khi retry cùng thao tác.

### Module khác qua proxy cũ

Endpoint RPC của module khác còn đi qua proxy cũ dùng `REQUEST_TYPE.REVERSE_PROXY` (`x-req-type: 6`); kết quả nằm
trong `body` của `SuccessServiceResponse`:

```tsx
return http.post<SuccessServiceResponse<ReportData>>(reportURI.data, params, {
    headers: createServiceHeader({ service: 3, type: REQUEST_TYPE.REVERSE_PROXY }),
});
```

Cấu hình workspace (`configApi.getServerConfigRpc`, `config-server`) dùng `REQUEST_TYPE.TS_PROJECT` (`x-req-type: 9`)
giống Cogover: response là `SuccessResponse<ServerConfig>` không bọc `body`, đọc `response.data.data`.

## 7. Server state

1. Dữ liệu server dùng TanStack Query.
2. Không gọi API bằng `useEffect` rồi tự quản lý `loading`, `error`, `data`.
3. Query key chứa toàn bộ input ảnh hưởng response.
4. Mutation thành công phải cập nhật hoặc invalidate cache liên quan.

```tsx
const query = useQuery({
    queryKey: requestApiKeys.detail(requestId),
    queryFn: async () => {
        const response = await requestApi.getDetail(requestId);
        return response.data.data;
    },
});
```

## 8. Production và standalone

1. Cùng một API module chạy ở cả hai môi trường.
2. Production gọi path tương đối qua domain của ứng dụng Cogover.
3. Standalone gọi cùng path qua Vite proxy.
4. Không kiểm tra hostname trong feature API để đổi URL.
5. `DevConfigGate` lấy config cần thiết trước khi render standalone page.

## 9. Header và app slug

Feature API không tự thêm:

1. `X-CSRF-TOKEN`
2. `X-Req-Id`
3. `X-Req-From`
4. `X-App-Slug`

HTTP client chung chịu trách nhiệm cho các header này. Feature chỉ thêm header nghiệp vụ riêng của endpoint.

`X-App-Slug` lấy từ app slug nền tảng Cogover truyền vào `CustomApp` (`AppSlugProvider`); thiếu prop (component `./Components/*`, được build tự bọc `AppSlugProvider`) thì lấy `useLibrary().appSlug`; standalone không có app slug nên không gửi header này. Không đọc `window.location` hay biến toàn cục để tự tính app slug: trong WebView (khung trình duyệt nhúng) của ứng dụng mobile, đường dẫn trang không chứa app slug.

Trong WebView mobile, module phải được mở trên domain workspace (`https://<workspace>.cogover.com`) để request tương đối, cookie và CSRF hoạt động như trên web.

## 10. Retry

1. Feature không tự viết vòng lặp retry.
2. Retry chung chỉ cấu hình tại HTTP client.
3. Endpoint không được phép gửi lại phải kiểm tra khả năng `disableRetry` trước khi triển khai.
4. Không bypass HTTP client chung để né retry.

## 11. Error handling

1. API layer trả lỗi về caller, không render UI.
2. Không tạo toast global trong API layer.
3. Giữ xử lý `401` chung tại `apiErrorHandler`.
4. Page/component quyết định cách hiển thị lỗi nghiệp vụ.
5. Không nuốt lỗi bằng `catch` rỗng.

## 12. Query-key factory

Mỗi domain có một root key và factory cho list/detail:

```tsx
export const requestApiKeys = {
    all: ['requests'] as const,
    list: (params: RequestListParams) => [...requestApiKeys.all, 'list', params] as const,
    detail: (requestId: string) => [...requestApiKeys.all, 'detail', requestId] as const,
};
```

Rules:

1. Mỗi domain có root key riêng.
2. ID, filter, page, sort và search ảnh hưởng response phải nằm trong key.
3. List và detail dùng key khác nhau.
4. Không dùng key chung chung như `['data']` hoặc `['list']`.
5. Query và mutation phải dùng cùng factory để invalidate đúng cache.

Sau mutation:

```tsx
await queryClient.invalidateQueries({ queryKey: requestApiKeys.detail(requestId) });
await queryClient.invalidateQueries({ queryKey: requestApiKeys.all });
```

## 13. Lọc bản ghi bằng FilterGenerator

Khi người dùng cần tự đặt điều kiện lọc bản ghi của một object (chọn trường, điều kiện, giá trị; kết hợp AND/OR/tùy chỉnh), dùng `FilterGenerator` của `@cogover/client-sdk` và đọc dữ liệu bằng `useRecords`. Kết quả của `FilterGenerator` có đúng định dạng `filters` mà `useRecords` nhận.

Good:

```tsx
import {
    FilterGenerator,
    ignoreEmptyParamsConditions,
    logicTypeParams,
    useObjectFields,
    useRecords,
    type FilterGeneratorItem,
    type FilterGeneratorLogicTypes,
} from '@cogover/client-sdk';
import { useState } from 'react';

export default function ContactFilter() {
    const { data: dataFields = [] } = useObjectFields({ slug: 'contact' });
    const [logicType, setLogicType] = useState<FilterGeneratorLogicTypes>('AND');
    const [logicValue, setLogicValue] = useState('');
    const [filterItems, setFilterItems] = useState<FilterGeneratorItem[]>([]);

    const { data, isFetching } = useRecords({
        objectSlug: 'contact',
        size: 20,
        filters: ignoreEmptyParamsConditions(filterItems),
        type: logicTypeParams[logicType],
        logic_sequence: logicType === 'CUSTOM' ? logicValue : undefined,
    });

    return (
        <>
            <FilterGenerator
                dataFields={dataFields}
                logicType={logicType}
                logicValue={logicValue}
                filterItems={filterItems}
                onChangeLogicType={setLogicType}
                onChangeLogicValue={setLogicValue}
                onChangeFilterItems={setFilterItems}
                clearable
                onReset={() => setFilterItems([])}
            />
            <p className='prose-body2 text-typo-secondary'>
                {isFetching ? 'Đang tải…' : `${data?.total ?? 0} bản ghi`}
            </p>
        </>
    );
}
```

Bad:

```tsx
const [field, setField] = useState('');
const [value, setValue] = useState('');

<select onChange={(e) => setField(e.target.value)}>...</select>;
<input onChange={(e) => setValue(e.target.value)} />;

http.post('/api/v1/records', { filters: [{ field, op: '=', params: value }], type: 1 });
```

Cách bad tự dựng UI lọc nên thiếu toán tử theo loại trường, ô chọn bản ghi cho trường lookup, ngày tương đối, logic tùy chỉnh và bản dịch; đồng thời gọi API record trực tiếp thay vì hook đã chuẩn hóa.

Rules:

1. Import component, helper và hook dữ liệu từ `@cogover/client-sdk` (gốc, không dùng `/ui`, `/data`). Không copy code FilterGenerator từ nơi khác vào module.
2. `dataFields` lấy từ `useObjectFields({ slug })` của object cần lọc; không tự khai báo danh sách trường. Trường không hoạt động được ẩn tự động.
3. Giữ `filterItems`, `logicType`, `logicValue` trong state của page và truyền thẳng vào `useRecords`: `filters` qua `ignoreEmptyParamsConditions`, `type` qua `logicTypeParams[logicType]`, `logic_sequence` chỉ khi `logicType` là `CUSTOM`.
4. Không tự validate biểu thức logic tùy chỉnh, không tự giới hạn số dòng, không tự làm nút đặt lại: dùng `showCustomLogicError` (mặc định bật), `maxFilterItemCount` (mặc định 30), `clearable` + `onReset`.
5. `disabled` ẩn danh sách điều kiện và khóa ô logic; `readOnly` vẫn hiển thị điều kiện nhưng không cho sửa.
6. Giá trị của trường lựa chọn là `slug` của option; trường lookup là ID bản ghi. Không đổi các giá trị này sang nhãn hiển thị trước khi gửi lên server.
7. Nút `{ }` cạnh ô giá trị chèn biến của người dùng hiện tại (ví dụ `$currentUser`, cờ `iu`); server tự thay giá trị khi lọc, không tự thay ở client.
8. `FilterGenerator` gọi API metadata object, filter của trường lookup và danh sách bản ghi qua `LibraryProvider`; không truyền HTTP client riêng vào component.
9. Cần bảng props đầy đủ (`getFieldOptions`, `renderValueInputWrapper`, `showPreview`, …) thì xem mục FilterGenerator trong README của `@cogover/client-sdk`.

Chạy trong nền tảng Cogover và standalone:

1. Khi nhúng, nền tảng Cogover đã đặt `LibraryProvider` và chia sẻ bản `@cogover/client-sdk` của nền tảng qua Module Federation. FilterGenerator cần bản SDK của nền tảng hỗ trợ component này.
2. Standalone dùng `ClientSdkProvider` trong `MainProvider`; provider này lấy workspace, ngôn ngữ, theme từ config mà `DevConfigGate` đã tải. Không bọc thêm `LibraryProvider` trong `App.tsx` hay component expose.
3. Bấm tên bản ghi đã chọn ở trường lookup sẽ mở chi tiết bản ghi theo cách của nền tảng; ở standalone, trang bản ghi mở trong tab mới.

## 14. Nhận push message từ Custom Backend Module

Custom Backend Module gửi push bằng `push.refreshRecords`, `push.toast`, `push.message` (`@cogover/sdk`). Module nhận bằng `useSocketListener` của `@cogover/client-sdk` (từ `0.3.0`); không tự mở WebSocket, không dùng `cogover-comm-web-sdk`.

```tsx
import { useSocketListener } from '@cogover/client-sdk';
import type { MessagePayload, RefreshRecordsPayload } from '@cogover/client-sdk';
import { useEffect } from 'react';

const { subscribe, unsubscribe, status } = useSocketListener();

useEffect(() => {
    // Chưa có recordId (trang tạo mới): không subscribe theo bản ghi. Muốn nhận push đích danh thì subscribe riêng,
    // không kèm objectSlug/recordId.
    if (!recordId) return;
    const target = { objectSlug: 'lead', recordId };
    const onRefresh = (_payload: RefreshRecordsPayload) => refetch();
    const onMessage = (payload: MessagePayload) => {
        const data = payload.data as { event?: string } | null;
        if (data?.event === 'order.synced') refetch();
    };

    subscribe('refreshRecords', onRefresh, target);
    subscribe('message', onMessage, { ...target, source: 'order_sync' });
    return () => {
        unsubscribe('refreshRecords', onRefresh);
        unsubscribe('message', onMessage);
    };
}, [recordId, refetch, subscribe, unsubscribe]);
```

| Event            | Backend gọi                                       | Payload                                                                                                                                          |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `refreshRecords` | `push.refreshRecords(object, recordIds, options)` | `{ recordId? }`                                                                                                                                  |
| `toast`          | `push.toast(message, options)`                    | `{ title?, content?, position, size, durationSeconds, links, objectSlug?, recordIds? }`                                                          |
| `message`        | `push.message({ content, contentType }, options)` | `{ data, content, contentType, recordId? }`; `contentType`: `'text'` \| `'template'`; `data` = `JSON.parse(content)`, không phải JSON thì `null` |

Rules:

1. Import từ gốc `@cogover/client-sdk` như mọi API khác của SDK ([custom-module-foundation](../custom-module-foundation/SKILL.md) mục 10); không import `@cogover/client-sdk/socket` trong module chạy qua nền tảng Cogover.
2. Đăng ký và huỷ trong `useEffect`; `subscribe` trả về hàm huỷ, nên có thể viết `useEffect(() => subscribe('toast', onToast), [subscribe])`. `unsubscribe` phải nhận lại đúng hàm handler đã đăng ký. `subscribe`, `unsubscribe` ổn định giữa các lần render, đưa vào deps an toàn.
3. Người nhận do backend quyết định (`options.recipients`). Push gửi cho người đang xem bản ghi (`"viewers"`, mặc định) chỉ tới khi subscribe có `objectSlug` + `recordId` đúng bản ghi đó; SDK tự tra object ID và đăng ký bản ghi với server. Push gửi đích danh (mảng personnel ID) tới mà không cần `objectSlug`/`recordId`; nhưng subscription đã truyền `recordId` sẽ bỏ qua push đích danh gắn với bản ghi khác.
4. Lấy `recordId` từ nguồn của nơi hiển thị: component Form Builder trên trang chi tiết bản ghi đọc tham số `recordId` của route (`useParams()` của `react-router-dom`); Custom Page lấy từ route hoặc dữ liệu của chính trang. Trang tạo mới bản ghi không có `recordId` (`useParams()` trả `undefined`): khi đó không subscribe theo bản ghi. Không tin record ID do người dùng nhập để quyết định quyền.
5. `source` chỉ lọc event `message`: backend gửi `content` là JSON có trường `source` (ví dụ tên project), trang truyền `source` tương ứng. Toast và refresh không phân biệt được module hay Process đã gửi.
6. Trên trang chi tiết bản ghi, nền tảng Cogover đã tự hiện toast và tự tải lại bản ghi; handler chỉ để module phản ứng thêm (ví dụ `refetch` dữ liệu của chính module), không hiện lại toast. Ở chế độ standalone không có lớp nền tảng này.
7. `payload.data` là dữ liệu không tin cậy (ai gọi được route backend cũng gửi được): kiểm tra cấu trúc trước khi dùng, không render HTML từ nó, không tự ghi dữ liệu chỉ dựa trên nó.
8. `status`: `idle` (chưa đăng ký), `connecting`, `connected`, `unauthorized` (không có phiên đăng nhập; SDK ngừng kết nối lại). Push là best-effort, không đảm bảo luôn tới: dữ liệu quan trọng vẫn đọc lại qua API.
9. Khi chạy trong nền tảng Cogover, module dùng `@cogover/client-sdk` của nền tảng (gói dùng chung qua Module Federation). Hook chỉ có khi nền tảng đã dùng client-sdk từ `0.3.0`: nền tảng cũ hơn thì `useSocketListener` là `undefined` và component lỗi khi render (không tự dùng bản cài trong dự án). Xác nhận phiên bản client-sdk của nền tảng trước khi triển khai. Chế độ standalone dùng bản cài trong dự án.
