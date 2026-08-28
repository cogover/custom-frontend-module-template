import { PropsWithChildren, useContext } from 'react';
import { AppSlugContext } from './appSlugContext';

interface AppSlugProviderProps extends PropsWithChildren {
    appSlug?: string;
}

function AppSlugContextProvider({ appSlug = '', children }: AppSlugProviderProps) {
    return <AppSlugContext.Provider value={appSlug}>{children}</AppSlugContext.Provider>;
}

export function AppSlugProvider(props: AppSlugProviderProps) {
    const parentAppSlug = useContext(AppSlugContext);
    if (parentAppSlug !== undefined) return <>{props.children}</>;

    return <AppSlugContextProvider {...props} />;
}
