import { Context, createContext, useCallback, useContext, useMemo } from 'react';
import * as ReactRouter from 'react-router-dom';
import {
    createPath,
    NavigateOptions as RouterNavigateOptions,
    parsePath,
    Path,
    resolvePath,
    To,
    useHref,
    useLocation,
    useNavigate as useRouterNavigate,
    useResolvedPath,
} from 'react-router-dom';
import { useAppSlug } from 'src/providers/appSlugContext';
import { addAppSlugToLink, isAbsoluteUrl } from 'src/utils/appSlugUtils';
import useNavigateInterceptor from './useNavigateInterceptor';

export interface NavigateOptions extends RouterNavigateOptions {
    withAppSlug?: boolean;
}

export interface NavigateFunction {
    (to: To, options?: NavigateOptions): void;
    (delta: number): void;
}

type RouteMatches = { pathnameBase: string; route: { path?: string } }[];
type RouteContextValue = { matches?: RouteMatches } | null;

/**
 * React Router không có hook công khai trả danh sách route đang khớp (ngoài data router), nên đọc
 * `UNSAFE_RouteContext` để `..` lùi theo route như `navigate` thật. Đây là API nội bộ của React Router v6:
 * xem lại khi nâng phiên bản lớn. Không có context này thì quay về resolve theo URL, không báo lỗi.
 */
const RouteContext =
    (ReactRouter as unknown as { UNSAFE_RouteContext?: Context<RouteContextValue> }).UNSAFE_RouteContext ??
    createContext<RouteContextValue>(null);

/**
 * Resolve đích giống `navigate` của react-router: chỉ có query/hash thì giữ path hiện tại;
 * `..` mặc định lùi theo route, `relative: 'path'` lùi theo đoạn URL.
 */
function resolveTarget(to: To, routePathnames: string[], locationPathname: string, relativePath: boolean): Path {
    const target = typeof to === 'string' ? parsePath(to) : { ...to };
    if (target.pathname === undefined && to !== '') return resolvePath(target, locationPathname);

    let routeIndex = routePathnames.length - 1;
    if (!relativePath && target.pathname?.startsWith('..')) {
        const segments = target.pathname.split('/');
        while (segments[0] === '..') {
            segments.shift();
            routeIndex -= 1;
        }
        target.pathname = segments.join('/');
    }
    return resolvePath(target, routeIndex >= 0 ? routePathnames[routeIndex] : '/');
}

/** Nối basename của router vào path đã resolve, giống `useHref`. */
function toHref(path: Path, basename: string) {
    const pathname = basename === '/' ? path.pathname : `${basename.replace(/\/+$/, '')}${path.pathname}`;
    return createPath({ ...path, pathname });
}

/**
 * Thay cho `useNavigate` của react-router-dom: gắn app slug như `Link` nội bộ
 * và hỏi nền tảng Cogover trước khi điều hướng.
 */
export default function useNavigate(): NavigateFunction {
    const navigate = useRouterNavigate();
    const appSlug = useAppSlug();
    const onNavigateIntercept = useNavigateInterceptor();
    const basename = useHref('/');
    const routePathname = useResolvedPath('.').pathname;
    const locationPathname = useLocation().pathname;
    const matches = useContext(RouteContext)?.matches;
    const hasRouteMatches = Array.isArray(matches);
    // Path các route cha như react-router dùng khi resolve `..`; route cuối lấy theo `useResolvedPath('.')`.
    const routePathnamesKey = JSON.stringify(
        (hasRouteMatches ? matches : [])
            .filter((match, index) => index === 0 || match.route.path)
            .map((match) => match.pathnameBase)
            .slice(0, -1)
            .concat(routePathname),
    );
    const routePathnames = useMemo(() => JSON.parse(routePathnamesKey) as string[], [routePathnamesKey]);

    return useCallback(
        (to: To | number, options: NavigateOptions = {}) => {
            if (typeof to === 'number') {
                if (onNavigateIntercept?.({ href: '', delta: to, source: 'navigate' })) return;
                navigate(to);
                return;
            }

            const { withAppSlug = true, ...navigateOptions } = options;
            const resolvedTo = withAppSlug ? addAppSlugToLink(to, appSlug) : to;
            if (onNavigateIntercept) {
                const handled = onNavigateIntercept({
                    href: isAbsoluteUrl(resolvedTo)
                        ? resolvedTo
                        : toHref(
                              resolveTarget(
                                  resolvedTo,
                                  routePathnames,
                                  locationPathname,
                                  navigateOptions.relative === 'path' || !hasRouteMatches,
                              ),
                              basename,
                          ),
                    target: '_self',
                    replace: navigateOptions.replace,
                    source: 'navigate',
                });
                if (handled) return;
            }

            navigate(resolvedTo, navigateOptions);
        },
        [appSlug, basename, hasRouteMatches, locationPathname, navigate, onNavigateIntercept, routePathnames],
    );
}
