import { TOptions } from 'i18next';
import { I18N_PROCESSORS } from '..';
import { isString } from 'lodash';
import { i18n } from 'src/languages/global';

const lazyLoadNamespaceProcessor = {
    name: I18N_PROCESSORS.LAZY_LOAD_NAMESPACE, // Tên của post processor
    type: 'postProcessor', // Loại plugin
    process(value: string, keys: string | string[], options: TOptions): string {
        const key = (isString(keys) ? keys : keys[0]) as string | undefined;

        if (key?.includes(':')) {
            const [ns, keyValue] = key.split(':');

            void i18n.loadNamespaces(ns);

            return i18n.t(keyValue, { ...options, ns });
        }

        const ns = options.ns;

        if (ns) {
            void i18n.loadNamespaces(ns);
        }

        return value;
    },
};

export default lazyLoadNamespaceProcessor;
