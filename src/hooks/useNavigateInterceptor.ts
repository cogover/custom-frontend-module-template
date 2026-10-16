import { useLibrary, type NavigateInterceptor } from '@cogover/client-sdk';

/**
 * Lấy `onNavigateIntercept` mà nền tảng Cogover truyền qua `LibraryProvider`.
 * Trả `undefined` khi nền tảng không chặn điều hướng (web thông thường, chế độ standalone).
 */
export default function useNavigateInterceptor(): NavigateInterceptor | undefined {
    return useLibrary().onNavigateIntercept;
}
