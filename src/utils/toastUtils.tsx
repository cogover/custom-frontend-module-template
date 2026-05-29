import { showToastMessage } from '@stringeecom/ui-kit';
import { t } from 'src/languages/global';
import { isNumber } from 'lodash';
import Trans from 'src/languages/global/Trans';

export const toastCommonError = (msg?: string) => {
    showToastMessage({
        type: 'warning',
        title: t('commonValidationMessages.titleOfCommonError'),
        message: msg ? msg : t('commonValidationMessages.contentOfCommonError'),
    });
};

export const toastTooManyRequest = ({ remainTime }: { remainTime: number | null }) => {
    if (isNumber(remainTime)) {
        return showToastMessage({
            type: 'warning',
            title: t('commonValidationMessages.titleOfCommonError'),
            message: (
                <Trans
                    i18nKey='commonValidationMessages.retryAfter'
                    values={{ remainTime }}
                    components={{ 1: <strong /> }}
                />
            ),
        });
    }

    showToastMessage({
        type: 'warning',
        title: 'Too many request',
        message: 'Too many request',
    });
};
