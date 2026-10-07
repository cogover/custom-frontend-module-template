import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'src/languages/i18n';
import App from './App.tsx';
import DevConfigGate from './dev/DevConfigGate.tsx';
import MainLayout from './dev/layout/MainLayout.tsx';
import MainProvider from './providers';

import '@fontsource-variable/nunito';
import './styles/index.css';

import 'dayjs/locale/en';
import 'dayjs/locale/vi';

/**
 * Entry STANDALONE — chỉ dùng khi dev/preview riêng module này.
 * Bọc `App` bằng provider + Router để giả lập môi trường mà host cung cấp.
 *
 * `BrowserRouter` nằm ngoài `MainProvider` để toàn bộ ứng dụng standalone dùng chung Router context.
 *
 * `DevConfigGate` chỉ chạy ở standalone: gọi config API và đổ vào Redux để mô phỏng
 * môi trường mà host cung cấp. Không nằm trong component `App` được expose.
 *
 * `MainLayout` (dev) mô phỏng header và sidebar của Cogover; sidebar liệt kê các page trong `APP_ROUTES` có `name`.
 * Khi nhúng, Cogover tự cung cấp header và sidebar thật.
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
