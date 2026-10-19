import { useLibrary } from '@cogover/client-sdk';
import { getListDateTimeFormat, getWorkspaceDateFormat } from 'src/utils/dateTimeFormat';

/**
 * Định dạng dayjs cho cột ngày giờ trong màn danh sách, lấy theo cài đặt workspace.
 * Trả `dateTimeFormat` (vd `DD/MM/YYYY, HH:mm:ss`) và `dateFormat` (vd `DD/MM/YYYY`).
 */
export function useListDateTimeFormat() {
    const workspace = useLibrary().commonSettings?.workspace;
    const dateType = workspace?.dateFormat;
    const timeType = workspace?.timeFormat;

    return {
        dateTimeFormat: getListDateTimeFormat(dateType, timeType),
        dateFormat: getWorkspaceDateFormat(dateType),
    };
}
