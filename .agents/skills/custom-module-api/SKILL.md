---
name: custom-module-api
description: Use when adding or changing API clients, endpoints, request types, TanStack Query hooks, mutations, query keys, RPC headers, retries, or API error handling in custom-module-template.
---

# Custom Module API

Thêm API theo đúng HTTP infrastructure của custom module để cùng code chạy được trong router host và standalone.

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
2. Path phải chạy qua Vite proxy ở standalone và cùng origin ở router host.
3. Không đặt URL endpoint trực tiếp trong component.

## 4. Type response

Dùng type nền tảng hiện có:

1. `SuccessResponse<Data, Meta>`
2. `SuccessServiceResponse<Data, Meta>`
3. `ErrorApiResponse<Data>`

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

1. Dùng `createServiceHeader` cho endpoint RPC.
2. Không hardcode `x-req-service` hoặc `x-req-type` tại call-site.

```tsx
return http.post<SuccessServiceResponse<ServerConfig>>(serverConfigURI.configServer, params, {
    headers: createServiceHeader({ service: 3, type: 6 }),
});
```

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
2. Production gọi path tương đối qua router origin.
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
