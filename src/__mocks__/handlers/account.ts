import { HttpHandler, HttpResponse, http } from 'msw';
import { accountUri } from 'src/apis/account/account.api';
import { _mockApiSuccess } from '../_mock';

export const accountHandlers: HttpHandler[] = [
    http.post(accountUri.logout, () => HttpResponse.json(_mockApiSuccess(true))),
];
