import type { ComponentType } from 'react';
import { AppSlugProvider } from './AppSlugProvider';
import ReduxProvider from './ReduxProvider';

/**
 * Bọc component expose `./Components/*` (build tự áp qua `scripts/expose-wrap.js`, component không tự gọi).
 * `AppSlugProvider` ở ngoài cùng: gán app slug của nền tảng (`useLibrary().appSlug`) ngay lúc render, trước effect
 * của component, để request trong component có `X-App-Slug`. Store riêng của module cũng sẵn như trong `App`.
 */
export default function withExposeProviders<P extends object>(Component: ComponentType<P>) {
    function ExposedComponent(props: P) {
        return (
            <AppSlugProvider>
                <ReduxProvider>
                    <Component {...props} />
                </ReduxProvider>
            </AppSlugProvider>
        );
    }
    ExposedComponent.displayName = `Exposed(${Component.displayName ?? Component.name})`;
    return ExposedComponent;
}
