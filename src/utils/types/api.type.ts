export interface PaginationV2 {
    search_after: string[];
    total: number;
}

export interface BaseResponse {
    id: string;
    created: number;
    updated: number;
}
