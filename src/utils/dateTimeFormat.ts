/** Mã `workspace.dateFormat` của Cogover → chuỗi định dạng dayjs (giống ui-kit). */
export const WORKSPACE_DATE_FORMATS: Record<number, string> = {
    1: 'DD/MM/YYYY',
    2: 'DD MMM YYYY',
    3: 'MMM DD, YYYY',
    4: 'MM/DD/YYYY',
    5: 'DD.MM.YYYY',
    6: 'YYYY-MM-DD',
    7: 'DD MMM YYYY',
};

/** Mã `workspace.timeFormat`: 1 = 12 giờ, 2 = 24 giờ. */
export const WORKSPACE_TIME_FORMATS: Record<number, string> = {
    1: 'h:mm A',
    2: 'HH:mm',
};

/**
 * Định dạng ngày giờ cho ô dữ liệu trong bảng danh sách, giống màn danh sách của Cogover:
 * `<ngày theo workspace>, <giờ có giây>`, ví dụ `01/10/2026, 09:27:01`.
 */
export function getListDateTimeFormat(dateFormat?: number | null, timeFormat?: number | null) {
    // Mặc định giống ui-kit: thiếu cài đặt thì dùng định dạng mã 1.
    const time = (timeFormat ?? 1) === 1 ? 'hh:mm:ss A' : 'HH:mm:ss';
    return `${getWorkspaceDateFormat(dateFormat)}, ${time}`;
}

/** Định dạng ngày (không có giờ) theo workspace, dùng cho cột chỉ có ngày như Hiệu lực. */
export function getWorkspaceDateFormat(dateFormat?: number | null) {
    return WORKSPACE_DATE_FORMATS[dateFormat ?? 1] ?? WORKSPACE_DATE_FORMATS[1];
}
