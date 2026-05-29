import classNames from 'classnames';
import classNamesBind from 'classnames/bind';
import { twMerge } from 'tailwind-merge';

export default function cx(...args: classNames.ArgumentArray) {
    return twMerge(classNames(...args));
}

export function cxBind(bind: CSSModuleClasses) {
    return (...args: classNames.ArgumentArray) => {
        const _classNames = classNamesBind.bind(bind);
        return twMerge(_classNames(...args));
    };
}
