export interface PaginationV2 {
    search_after: string[];
    total: number;
}

export interface BaseResponse {
    id: string;
    created: number;
    updated: number;
}

export interface SuccessResponse<Data, Meta = null> {
    msg: string;
    r: number;
    data: Data;
    meta: Meta;
    requestId: string;
}

export interface SuccessServiceResponse<Data = null, Meta = null> {
    serviceVersion: number;
    service: number;
    id: number;
    type: number;
    body: SuccessResponse<Data, Meta>;
}

export interface ErrorApiResponse<Data = null> {
    msg: string;
    r: number;
    meta?: Data;
    data?: Data;
}
