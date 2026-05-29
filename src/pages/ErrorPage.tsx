import { useReloadPage } from '@stringeecom/ui-kit';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
type RouterError = Error;

function isRouterError(object: unknown): object is RouterError {
    return 'message' in (object as RouterError);
}

function errorMessage(error: unknown): string {
    if (isRouteErrorResponse(error)) {
        return `${error.status} ${error.statusText}`;
    } else if (error != undefined && isRouterError(error)) {
        return error.message;
    } else if (typeof error === 'string') {
        return error;
    } else {
        console.error(error);
        return 'Unknown error';
    }
}
// Sử dụng error page này khi dùng loader của react-router
export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    const message = errorMessage(error);

    const reloadConditions =
        message.startsWith('Failed to fetch dynamically imported module') ||
        (isRouteErrorResponse(error) && error.status === 404);

    // Reload nếu không tải được link file js
    useReloadPage({
        condition: reloadConditions,
    });

    return (
        <div id='error-page'>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{message}</i>
            </p>
        </div>
    );
}
