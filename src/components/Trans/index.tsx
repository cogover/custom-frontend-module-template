import { Trans as I18nTrans } from 'react-i18next';

const Trans: typeof I18nTrans = (props) => {
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

export default Trans;
