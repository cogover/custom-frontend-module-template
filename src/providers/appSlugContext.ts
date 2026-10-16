import { createContext, useContext } from 'react';

export const AppSlugContext = createContext<string | undefined>(undefined);

export function useAppSlug() {
    const appSlug = useContext(AppSlugContext);
    if (appSlug === undefined) throw new Error('useAppSlug must be used within AppSlugProvider');
    return appSlug;
}

let currentAppSlug = '';

/** App slug nền tảng Cogover truyền vào, dùng ở nơi ngoài React như interceptor của axios. */
export function getCurrentAppSlug() {
    return currentAppSlug;
}

export function setCurrentAppSlug(appSlug: string) {
    currentAppSlug = appSlug;
}
