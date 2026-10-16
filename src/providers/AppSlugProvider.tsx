import { PropsWithChildren, useContext } from 'react';
import { AppSlugContext, setCurrentAppSlug } from './appSlugContext';

interface AppSlugProviderProps extends PropsWithChildren {
    appSlug?: string;
}

function AppSlugContextProvider({ appSlug = '', children }: AppSlugProviderProps) {
    // Gán trong lúc render để request của component con (chạy trong effect của con, trước effect của cha) đã có slug.
    setCurrentAppSlug(appSlug);
    return <AppSlugContext.Provider value={appSlug}>{children}</AppSlugContext.Provider>;
}

export function AppSlugProvider(props: AppSlugProviderProps) {
    const parentAppSlug = useContext(AppSlugContext);
    if (parentAppSlug !== undefined) return <>{props.children}</>;

    return <AppSlugContextProvider {...props} />;
}
