import { useLibrary } from '@cogover/client-sdk';
import { PropsWithChildren, useContext } from 'react';
import { AppSlugContext, setCurrentAppSlug } from './appSlugContext';

interface AppSlugProviderProps extends PropsWithChildren {
    appSlug?: string;
}

function AppSlugContextProvider({ appSlug, children }: AppSlugProviderProps) {
    const library = useLibrary();
    // Thiếu prop (vd component trên layout) thì lấy app slug nền tảng cấp qua `LibraryProvider`.
    const resolvedAppSlug = appSlug || library.appSlug || '';
    // Gán trong lúc render để request của component con (chạy trong effect của con, trước effect của cha) đã có slug.
    setCurrentAppSlug(resolvedAppSlug);
    return <AppSlugContext.Provider value={resolvedAppSlug}>{children}</AppSlugContext.Provider>;
}

export function AppSlugProvider(props: AppSlugProviderProps) {
    const parentAppSlug = useContext(AppSlugContext);
    if (parentAppSlug !== undefined) return <>{props.children}</>;

    return <AppSlugContextProvider {...props} />;
}
