import {
    showToastMessage,
    useUpdateTableSetting,
    type ColumnType,
    type TablePinnedColumns,
} from '@cogover/client-sdk/ui';
import { useCallback } from 'react';
import { useAppSlug } from 'src/providers/appSlugContext';
import { setCommonSettingState } from 'src/store/commonSettingsSlice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

const DEFAULT_COLUMN_WIDTH = 150;

export interface TableSettingsValue<T> {
    columns: ColumnType<T>[];
    showingColumns?: string[];
    pinnedColumns?: TablePinnedColumns;
}

/**
 * Lưu cấu hình cột của bảng (dùng làm `onConfirm` của `TableSettings`) lên server của Cogover.
 * Standalone: cập nhật thêm `tableSetting` trong Redux để `useTableV2` đọc đúng cấu hình mới khi mở lại trang.
 * Khi nhúng, Cogover tự tải lại server config sau khi lưu.
 */
export function useSaveTableSetting<T>(tableName: string) {
    const appSlug = useAppSlug();
    const dispatch = useAppDispatch();
    const savedTableSettings = useAppSelector((state) => state.commonSettings.tableSetting);
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
                        : [...tableSettings, { tableName, settings: serialized } as (typeof tableSettings)[number]];
                    dispatch(setCommonSettingState({ tableSetting }));
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
