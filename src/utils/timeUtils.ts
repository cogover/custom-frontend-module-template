import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const formatDateTime = (value: string | number | undefined, typeFormat = 'DD/MM/YYYY', defaultValue = '--') => {
    if (!value) {
        return defaultValue;
    }

    const dateValue = typeof value === 'number' ? dayjs.unix(value) : dayjs(value);

    if (!dateValue.isValid()) {
        return defaultValue;
    }

    const validFormat = typeof typeFormat === 'string' && typeFormat.trim() !== '' ? typeFormat : 'YYYY-MM-DD';
    const formattedDate = dateValue.format(validFormat);

    return formattedDate;
};
