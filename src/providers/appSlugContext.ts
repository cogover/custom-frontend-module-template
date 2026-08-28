import { createContext, useContext } from 'react';

export const AppSlugContext = createContext<string | undefined>(undefined);

export function useAppSlug() {
    const appSlug = useContext(AppSlugContext);
    if (appSlug === undefined) throw new Error('useAppSlug must be used within AppSlugProvider');
    return appSlug;
}
