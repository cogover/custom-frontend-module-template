import { DEVELOPMENT_MODE } from 'src/utils/constant/app';

// Re-export all types and utilities from @stringeecom/ui-kit
export type {
    SuccessResponse,
    PaginationResponse,
    ObjectServerErrorApiResponse,
    Pagination,
    PaginationResponseObject,
    CamelCasePagination,
    WorkflowPagination,
    ErrorApiResponse,
    SuccessServiceResponse,
    JavaServiceRequest,
    RetryAxiosRequestConfig,
    IdentifyAxiosRequestConfig,
    IdentifyAxiosError,
    HttpPostConfig,
} from '@stringeecom/ui-kit';

import { createHttpInstance } from '@stringeecom/ui-kit';

// Re-export Http class from ui-kit
export { Http } from '@stringeecom/ui-kit';

const http = createHttpInstance({ hasRetry: DEVELOPMENT_MODE === 'production' });

export default http;
