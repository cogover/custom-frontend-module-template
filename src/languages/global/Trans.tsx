import { Trans as I18nTrans } from 'react-i18next';
import { useTranslation } from '.';

const TransDefault: typeof I18nTrans = (props) => {
    // Dịch theo ngôn ngữ của nền tảng và render lại khi ngôn ngữ/namespace thay đổi.
    const { t } = useTranslation(props.ns);

    return (
        <I18nTrans
            shouldUnescape
            t={t}
            {...props}
            components={{
                br: <br />,
                ...props.components,
            }}
        />
    );
};

const Trans = TransDefault;

export default Trans;
