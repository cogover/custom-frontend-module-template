interface HeaderService {
    service: number;
    type: number;
}
export const X_TYPE_KEY = 'x-req-type';
export const X_SERVICE_KEY = 'x-req-service';
/** Header response đánh dấu lỗi do chính Authorization Server sinh ra, không phải của backend. */
export const X_PROXY_ERROR_KEY = 'x-proxy-error';

/** Giá trị `x-req-type` của reverse proxy qua Authorization Server. */
export const REQUEST_TYPE = {
    /** Proxy cũ cho các module khác: kết quả được bọc trong `SuccessServiceResponse` (`body`). */
    REVERSE_PROXY: 6,
    /** Custom Backend Module (`/api/v1/ts-projects/...`): nguyên HTTP status, header và body của backend, không bọc. */
    TS_PROJECT: 9,
} as const;

export function createServiceHeader({ service, type }: HeaderService) {
    return {
        [X_TYPE_KEY]: type,
        [X_SERVICE_KEY]: service,
    };
}

/**
 * Lỗi do Authorization Server trả thay backend (phiên hết hạn, định tuyến, backend không khả dụng hoặc hết thời gian
 * chờ); body khi đó là `{ r, msg }`.
 */
export function isProxyError(error: unknown): boolean {
    const headers = (error as { response?: { headers?: Record<string, unknown> } } | null)?.response?.headers;
    return headers?.[X_PROXY_ERROR_KEY] === '1';
}
