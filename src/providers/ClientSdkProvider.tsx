import * as queryHooks from '@tanstack/react-query';
import { LibraryProvider, type LibraryCommonSettings } from '@cogover/client-sdk';
import '@cogover/client-sdk/styles.css';
import { PropsWithChildren, useMemo } from 'react';
import http from 'src/apis/apiBase';
import { useAppSelector } from 'src/store/hooks';
import { useDisplayLanguage, useSelectTheme } from 'src/store/commonSettingsSlice';
import { ThemeType } from 'src/theme/theme.type';

/**
 * CHỈ DÙNG CHO DEV STANDALONE — khi nhúng vào Cogover, nền tảng đã đặt sẵn LibraryProvider
 * và chia sẻ cùng một bản `@cogover/client-sdk` qua Module Federation.
 *
 * Cấp cấu hình cho `useLibrary()` từ dữ liệu workspace `DevConfigGate` lưu trong store dev, giống các trường
 * nền tảng cấp khi nhúng. Standalone không có app slug.
 */
export default function ClientSdkProvider({ children }: PropsWithChildren) {
    const workspace = useAppSelector((state) => state.commonSettings.workspace);
    const workspaceAccount = useAppSelector((state) => state.commonSettings.workspaceAccount);
    const tableSetting = useAppSelector((state) => state.commonSettings.tableSetting);
    const personnel = useAppSelector((state) => state.commonSettings.personnel);
    const apps = useAppSelector((state) => state.commonSettings.apps);
    const locale = useDisplayLanguage();
    const themeMode = useSelectTheme() === ThemeType.dark ? 'dark' : 'light';
    const commonSettings = useMemo(
        (): LibraryCommonSettings => ({
            workspace,
            workspaceAccount,
            tableSetting,
            // Config API trả bản ghi nhân sự đầy đủ; template chưa khai báo kiểu chi tiết.
            personnel: personnel as LibraryCommonSettings['personnel'],
            apps,
        }),
        [workspace, workspaceAccount, tableSetting, personnel, apps],
    );

    return (
        <LibraryProvider
            locale={locale}
            themeMode={themeMode}
            themeVersion={workspaceAccount?.setting?.themeVersion ?? 'v2'}
            workspaceId={workspace?.id ?? ''}
            appSlug=''
            http={http}
            queryHooks={queryHooks}
            commonSettings={commonSettings}
        >
            {children}
        </LibraryProvider>
    );
}
