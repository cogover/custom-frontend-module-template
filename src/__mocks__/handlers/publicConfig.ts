import { HttpHandler, HttpResponse, http } from 'msw';
import { serverConfigURI } from 'src/apis/config/config.api';
import { _mockApiSuccess } from '../_mock';
import { VALID_PUBLIC_RSA_KEY } from '../publicConfig';
import { VALID_COMMON_SETTINGS_STATE } from '../auth';

export const publicConfigHandlers: HttpHandler[] = [
    http.get(serverConfigURI.public, publicConfigResolver),
    http.post(serverConfigURI.index, serverConfigResolver),
];

function publicConfigResolver() {
    return HttpResponse.json(
        _mockApiSuccess({
            publicKey: VALID_PUBLIC_RSA_KEY,
        }),
    );
}

export function serverConfigResolver() {
    return HttpResponse.json(_mockApiSuccess(VALID_COMMON_SETTINGS_STATE));
}
