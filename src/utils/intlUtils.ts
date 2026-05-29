import { t } from 'src/languages/global';
import { I18nNS } from 'src/languages/i18n';

export const tCommon = (key: string) => t(key, { ns: I18nNS.COMMON });
export const tSubscription = (key: string) => t(key, { ns: I18nNS.SUBSCRIPTION });
