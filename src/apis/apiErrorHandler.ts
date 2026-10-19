import { AxiosError, HttpStatusCode } from 'axios';

import { moduleStore } from 'src/store';
import { setCommonSettingState } from 'src/store/commonSettingsSlice';
import { ErrorApiResponse } from './apiBase';

export const handledErrorStatus = [HttpStatusCode.Unauthorized];

const apiErrorHandler = (error: AxiosError<ErrorApiResponse>) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
        moduleStore.dispatch(
            setCommonSettingState({
                account: null,
                tokenID: '',
            }),
        );
    }
};

export default apiErrorHandler;
