import { useLibrary } from '@cogover/client-sdk';

/** Đích điều hướng gửi cho nền tảng Cogover trước khi custom module tự điều hướng. */
export interface NavigateTarget {
    /** Path đã gồm app slug như router sẽ đi tới, hoặc URL tuyệt đối. Rỗng khi chỉ có `delta`. */
    href: string;
    target?: '_self' | '_blank';
    replace?: boolean;
    /** Điều hướng lịch sử, ví dụ `navigate(-1)` → `delta: -1`. */
    delta?: number;
    source?: 'link' | 'navlink' | 'navigate' | 'open-url';
}

/** Trả `true` khi nền tảng Cogover đã xử lý; custom module không tự điều hướng nữa. */
export type NavigateInterceptor = (target: NavigateTarget) => boolean;

/**
 * Lấy `onNavigateIntercept` mà nền tảng Cogover truyền qua `LibraryProvider`.
 * Trả `undefined` khi nền tảng không chặn điều hướng (web thông thường, chế độ standalone).
 */
export default function useNavigateInterceptor(): NavigateInterceptor | undefined {
    // Đọc phòng thủ: `@cogover/client-sdk` bản cũ chưa có `onNavigateIntercept`.
    const { onNavigateIntercept } = useLibrary() as { onNavigateIntercept?: unknown };
    return typeof onNavigateIntercept === 'function' ? (onNavigateIntercept as NavigateInterceptor) : undefined;
}
