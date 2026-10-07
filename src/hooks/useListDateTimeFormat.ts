import { useAppSelector } from 'src/store/hooks';
import { getListDateTimeFormat, getWorkspaceDateFormat } from 'src/utils/dateTimeFormat';

/**
 * Định dạng dayjs cho cột ngày giờ trong màn danh sách, lấy theo cài đặt workspace.
 * Trả `dateTimeFormat` (vd `DD/MM/YYYY, HH:mm:ss`) và `dateFormat` (vd `DD/MM/YYYY`).
 */
export function useListDateTimeFormat() {
    const dateType = useAppSelector((state) => state.commonSettings.workspace?.dateFormat);
    const timeType = useAppSelector((state) => state.commonSettings.workspace?.timeFormat);

    return {
        dateTimeFormat: getListDateTimeFormat(dateType, timeType),
        dateFormat: getWorkspaceDateFormat(dateType),
    };
}
