import {
    showToastMessage,
    useLibrary,
    useUpdateTableSetting,
    type ColumnType,
    type TablePinnedColumns,
} from '@cogover/client-sdk';
import { useCallback } from 'react';
import { useAppSlug } from 'src/providers/appSlugContext';
import type { CommonSettingsState } from 'src/apis/config/config.type';
import { setCommonSettingState } from 'src/store/commonSettingsSlice';
import { useAppDispatch } from 'src/store/hooks';

const DEFAULT_COLUMN_WIDTH = 150;

export interface TableSettingsValue<T> {
    columns: ColumnType<T>[];
    showingColumns?: string[];
    pinnedColumns?: TablePinnedColumns;
}

/**
 * Lưu cấu hình cột của bảng (dùng làm `onConfirm` của `TableSettings`) lên server của Cogover.
 * Standalone: cập nhật thêm `tableSetting` trong store dev (nguồn của `ClientSdkProvider`) để `useTableV2` đọc
 * đúng cấu hình mới khi mở lại trang.
 * Khi nhúng, Cogover tự tải lại server config sau khi lưu.
 */
export function useSaveTableSetting<T>(tableName: string) {
    const appSlug = useAppSlug();
    const dispatch = useAppDispatch();
    const savedTableSettings = useLibrary().commonSettings?.tableSetting;
    const { mutateAsync } = useUpdateTableSetting();

    return useCallback(
        (value: TableSettingsValue<T>) => {
            const settings = {
                showingColumns: value.showingColumns,
                pinnedColumns: value.pinnedColumns,
                columns: value.columns.map(({ key, width }) => ({ key, width: width ?? DEFAULT_COLUMN_WIDTH })),
            };

            mutateAsync({ tableName, settings })
                .then(() => {
                    if (appSlug) return;
                    const tableSettings = savedTableSettings ?? [];
                    const serialized = JSON.stringify(settings);
                    const exists = tableSettings.some((setting) => setting.tableName === tableName);
                    const tableSetting = exists
                        ? tableSettings.map((setting) =>
                              setting.tableName === tableName ? { ...setting, settings: serialized } : setting,
                          )
                        : [...tableSettings, { tableName, settings: serialized }];
                    dispatch(
                        setCommonSettingState({ tableSetting: tableSetting as CommonSettingsState['tableSetting'] }),
                    );
                })
                .catch((error: unknown) => {
                    showToastMessage({
                        type: 'error',
                        title: 'Không lưu được cấu hình cột',
                        message: error instanceof Error ? error.message : undefined,
                    });
                });
        },
        [appSlug, dispatch, mutateAsync, savedTableSettings, tableName],
    );
}
