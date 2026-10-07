import * as queryHooks from '@tanstack/react-query';
import { LibraryProvider } from '@cogover/client-sdk/provider';
import '@cogover/client-sdk/styles.css';
import { PropsWithChildren, useMemo } from 'react';
import http from 'src/apis/apiBase';
import { useAppSelector } from 'src/store/hooks';
import { useDisplayLanguage, useSelectTheme } from 'src/store/commonSettingsSlice';
import { ThemeType } from 'src/theme/theme.type';
import { useAppSlug } from './appSlugContext';

/**
 * CHỈ DÙNG CHO DEV STANDALONE — khi nhúng vào Cogover, nền tảng đã đặt sẵn LibraryProvider
 * và chia sẻ cùng một bản `@cogover/client-sdk` qua Module Federation.
 *
 * Cấp cấu hình cho component/hook của `@cogover/client-sdk` từ dữ liệu workspace trong Redux.
 */
export default function ClientSdkProvider({ children }: PropsWithChildren) {
    const workspace = useAppSelector((state) => state.commonSettings.workspace);
    const workspaceAccount = useAppSelector((state) => state.commonSettings.workspaceAccount);
    const locale = useDisplayLanguage();
    const themeMode = useSelectTheme() === ThemeType.dark ? 'dark' : 'light';
    const appSlug = useAppSlug();
    const commonSettings = useMemo(() => ({ workspace, workspaceAccount }), [workspace, workspaceAccount]);

    return (
        <LibraryProvider
            locale={locale}
            themeMode={themeMode}
            workspaceId={workspace?.id ?? ''}
            appSlug={appSlug}
            http={http}
            queryHooks={queryHooks}
            commonSettings={commonSettings}
        >
            {children}
        </LibraryProvider>
    );
}
