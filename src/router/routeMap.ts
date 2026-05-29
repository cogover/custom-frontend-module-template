import { SupportedLanguagesKeys } from 'src/languages/i18n';
import { DEFAULT_CONTINUE_URL } from 'src/utils/appUtils';
import { LOGIN_URL } from 'src/utils/constant/url';

export const ROUTE_MAP = {
    index: '',
} as const;

type RouteMap = typeof ROUTE_MAP;

const toPath = (parentPath: string, path: string) => {
    if (parentPath === '' || parentPath === '/') {
        return `/${path}`;
    }
    if (path === '' || path === '/') {
        return parentPath;
    }
    return `${parentPath}/${path}`;
};

type RouteMapUseType = Record<string, unknown>;

export function generateRouteFullPath(map: unknown = ROUTE_MAP, parentPath = '') {
    const result: RouteMapUseType = {} as RouteMapUseType;

    for (const key in map as RouteMapUseType) {
        const path = (map as RouteMapUseType)[key];

        if (typeof path === 'string') {
            const fullPath = toPath(parentPath, path);
            result[key] = fullPath;
        } else {
            result[key] = generateRouteFullPath(path, toPath(parentPath, (map as RouteMapUseType).index as string));
        }
    }

    return result as RouteMap;
}

/**
 * routeMap.internal_test.example_1.index === "/internal_test/example_1"
 */
export const routeMapFullPath = Object.freeze(generateRouteFullPath());

export const loginUrl = (
    p: LoginUrlParams = {
        continue: DEFAULT_CONTINUE_URL,
    },
) => {
    const params = new URLSearchParams(p as Record<string, string>);
    return `${LOGIN_URL}?${params.toString()}`;
};

export interface LoginUrlParams {
    continue?: string;
    authToken?: string;
    isRegister?: string;
    lang?: SupportedLanguagesKeys;

    [key: string]: string | undefined;
}
