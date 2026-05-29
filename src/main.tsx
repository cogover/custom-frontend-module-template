import ReactDOM from 'react-dom/client';

import 'src/languages/i18n';
import App from './App.tsx';

import '@fontsource-variable/nunito';
import './styles/index.css';

import 'dayjs/locale/en';
import 'dayjs/locale/vi';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
