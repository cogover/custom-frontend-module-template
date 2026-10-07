import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/** Kiểu giá trị của một điều kiện lọc trên URL: chuỗi, danh sách (phân tách bằng dấu phẩy) hoặc số. */
export type UrlFilterType = 'string' | 'list' | 'number';

export type UrlFilterSchema = Record<string, UrlFilterType>;

type UrlFilterValue<T extends UrlFilterType> = T extends 'string'
    ? string
    : T extends 'list'
      ? string[]
      : number | null;

export type UrlFilters<S extends UrlFilterSchema> = { [K in keyof S]: UrlFilterValue<S[K]> };

function parseValue(type: UrlFilterType, raw: string | null) {
    if (type === 'list') {
        return raw?.split(',').filter(Boolean) ?? [];
    }
    if (type === 'number') {
        if (raw === null || raw === '') return null;
        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return raw ?? '';
}

function serializeValue(value: unknown) {
    if (Array.isArray(value)) return value.join(',');
    return value == null ? '' : String(value);
}

/**
 * Điều kiện lọc của màn danh sách, lưu trên query string để tải lại hoặc chia sẻ link vẫn giữ bộ lọc.
 * Giá trị rỗng (chuỗi rỗng, mảng rỗng, `null`) bị xoá khỏi URL; tham số không có trong `schema` được giữ nguyên.
 *
 * `schema` khai báo ở cấp module để giữ tham chiếu ổn định, ví dụ:
 * `const FILTER_SCHEMA = { keyword: 'string', statuses: 'list', createdFrom: 'number' } as const;`
 */
export function useUrlFilters<S extends UrlFilterSchema>(schema: S) {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters = useMemo(() => {
        const result: Record<string, unknown> = {};
        Object.entries(schema).forEach(([key, type]) => {
            result[key] = parseValue(type, searchParams.get(key));
        });
        return result as UrlFilters<S>;
    }, [schema, searchParams]);

    const updateFilters = useCallback(
        (changes: Partial<UrlFilters<S>>) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    Object.entries(changes).forEach(([key, value]) => {
                        const serialized = serializeValue(value);
                        if (serialized) next.set(key, serialized);
                        else next.delete(key);
                    });
                    return next;
                },
                { replace: true },
            );
        },
        [setSearchParams],
    );

    const resetFilters = useCallback(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                Object.keys(schema).forEach((key) => next.delete(key));
                return next;
            },
            { replace: true },
        );
    }, [schema, setSearchParams]);

    return { filters, updateFilters, resetFilters };
}
