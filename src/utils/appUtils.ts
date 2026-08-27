import { ThemeType } from 'src/theme/theme.type';

export function redirectExternalUrl(url: string) {
    window.location.href = url;
}

export const removeSearchParam = (key: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete(key);
    const finalSearch = searchParams.size === 0 ? '' : `?${searchParams.toString()}`;
    return finalSearch;
};

export const DEFAULT_CONTINUE_URL = window.location.origin;

export const setBrandColor = (color: string) => {
    document.documentElement.style.setProperty('--primary-brand', color);
};

export const localBrandColor = () => {
    const BRAND_COLOR_KEY = 'brandColor';
    return {
        get: () => {
            return localStorage.getItem(BRAND_COLOR_KEY) ?? '';
        },
        set: (color: string) => {
            localStorage.setItem(BRAND_COLOR_KEY, color);
        },
        clear: () => {
            localStorage.removeItem(BRAND_COLOR_KEY);
        },
    };
};

export const localTheme = () => {
    const THEME_KEY = 'theme';
    return {
        get: () => {
            return (localStorage.getItem(THEME_KEY) as ThemeType) ?? ThemeType.light;
        },
        set: (theme: ThemeType) => {
            localStorage.setItem(THEME_KEY, theme);
        },
        clear: () => {
            localStorage.removeItem(THEME_KEY);
        },
    };
};

export function uuidv4() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
        (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
    );
}

export const parseJSONSafe = <ReturnedType>(string: string, fallback: ReturnedType): ReturnedType => {
    try {
        return JSON.parse(string) as ReturnedType;
    } catch {
        return fallback;
    }
};
