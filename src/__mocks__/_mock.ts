import {
    _API_MESSAGES_DEFAULT,
    _BOOLEANS,
    _EMAILS,
    _FIRST_NAMES,
    _FULL_NAMES,
    _ID,
    IMAGES as _IMAGES,
    _LAST_NAMES,
    _PASSWORDS,
    __PHONE_NUMBER as _PHONE_NUMBER,
    SENTENCES as _SENTENCES,
    _PERSONNEL,
} from './assets';

export const _mock = {
    id: (index: number) => _ID[index],
    boolean: (index: number) => _BOOLEANS[index],
    email: (index: number) => _EMAILS[index],
    fullName: (index: number) => _FULL_NAMES[index],
    firstName: (index: number) => _FIRST_NAMES[index],
    lastName: (index: number) => _LAST_NAMES[index],
    apiMsgDefault: _API_MESSAGES_DEFAULT,
    phoneNumber: (index: number) => _PHONE_NUMBER[index],
    password: _PASSWORDS,
    sentence: (index: number) => _SENTENCES[index],
    images: () => _IMAGES[0],
    personnel: (index: number) => _PERSONNEL[index],
};

export const _mockApiSuccess = <D, M = null>(data: D, meta?: M) => ({
    r: 0,
    msg: _mock.apiMsgDefault.success,
    data: data,
    meta: meta,
});

export const _mockApiError = (msg: string, r?: number) => ({
    msg,
    r,
});

export const _mockSuccessServiceApi = <T = null>({
    service,
    type,
    data,
}: {
    service: number;
    type: number;
    data?: T;
}) => ({
    serviceVersion: 1,
    service,
    type,
    body: _mockApiSuccess(data),
});
