import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'src/languages/i18n';
import App from './App.tsx';
import MainProvider from './providers';

import '@fontsource-variable/nunito';
import './styles/index.css';

import 'dayjs/locale/en';
import 'dayjs/locale/vi';

/**
 * Entry STANDALONE — chỉ dùng khi dev/preview riêng module này.
 * Bọc `App` bằng provider + Router để giả lập môi trường mà host cung cấp.
 *
 * `BrowserRouter` nằm NGOÀI `MainProvider` vì `ThemeProvider` dùng các hook
 * của react-router (useSearchParams/useLocation/useNavigate…) nên cần Router context ở trên.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <MainProvider>
            <App />
        </MainProvider>
    </BrowserRouter>,
);
