interface HeaderService {
    service: number;
    type: number;
}
export const X_TYPE_KEY = 'x-req-type';
export const X_SERVICE_KEY = 'x-req-service';
export function createServiceHeader({ service, type }: HeaderService) {
    return {
        [X_TYPE_KEY]: type,
        [X_SERVICE_KEY]: service,
    };
}
