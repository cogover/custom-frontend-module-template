import { HttpHandler, PathParams } from 'msw';
import { HttpRequestResolverExtras } from 'node_modules/msw/lib/core/handlers/HttpHandler';
import { DefaultBodyType, ResponseResolverInfo } from 'node_modules/msw/lib/core/handlers/RequestHandler';

import { accountHandlers } from './account';
import { publicConfigHandlers } from './publicConfig';

export type ResolverParams = ResponseResolverInfo<HttpRequestResolverExtras<PathParams>, DefaultBodyType>;
export const handlers: HttpHandler[] = [...publicConfigHandlers, ...accountHandlers];
