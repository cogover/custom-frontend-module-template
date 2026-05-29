import { Trans as I18nTrans } from 'react-i18next';

const TransDefault: typeof I18nTrans = (props) => {
    return (
        <I18nTrans
            shouldUnescape
            {...props}
            components={{
                br: <br />,
                // eslint-disable-next-line react/prop-types
                ...props.components,
            }}
        />
    );
};

const Trans = window.Trans ?? TransDefault;

export default Trans;
