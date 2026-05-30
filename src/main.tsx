import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'src/languages/i18n';
import App from './App.tsx';
import DevConfigGate from './dev/DevConfigGate.tsx';
import MainLayout from './dev/MainLayout.tsx';
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
 *
 * `DevConfigGate` chỉ chạy ở standalone: gọi config API và đổ vào Redux để mô phỏng
 * môi trường mà host cung cấp. Không nằm trong component `App` được expose.
 *
 * `MainLayout` (dev) bọc `App` để có sidebar điều hướng giữa các page khi dev riêng —
 * host có MainLayout riêng nên KHÔNG đưa layout này vào component `App` được expose.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <MainProvider>
            <DevConfigGate>
                <MainLayout>
                    <App />
                </MainLayout>
            </DevConfigGate>
        </MainProvider>
    </BrowserRouter>,
);
