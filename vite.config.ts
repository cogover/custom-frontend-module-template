import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import federationConfig from './src/federation/federation.config.tsx';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    const certKey = env.VITE_CERT_KEY_PATH ? fs.readFileSync(env.VITE_CERT_KEY_PATH) : '';
    const cert = env.VITE_CERT_PATH ? fs.readFileSync(env.VITE_CERT_PATH) : '';

    const hasCerts = !!certKey && !!cert;

    return {
        plugins: [
            react(),
            !hasCerts && basicSsl(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            federationConfig(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            eslintPlugin({
                cache: false,
                include: ['./src/**/*.js', './src/**/*.jsx', './src/**/*.ts', './src/**/*.tsx'],
                exclude: [],
                failOnError: false,
            }),
        ].filter(Boolean),
        server: {
            host: env.VITE_LOCAL_HOST || '0.0.0.0',
            https: hasCerts
                ? {
                      key: fs.readFileSync(env.VITE_CERT_KEY_PATH),
                      cert: fs.readFileSync(env.VITE_CERT_PATH),
                  }
                : {},
            port: 5002,
            open: true,
            proxy: {
                '/api': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '/files': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '/websocket': {
                    // Thêm một proxy để chuyển tiếp WebSocket
                    target: (env.VITE_API_BASE_URL ?? '').replace('https', 'wss'),
                    changeOrigin: true,
                    secure: false, // Sử dụng true nếu WebSocket server sử dụng HTTPS/WSS
                    ws: true, // Bật hỗ trợ WebSocket
                },
                '/static': {
                    target: env.VITE_API_BASE_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        css: {
            devSourcemap: true,
        },
        resolve: {
            alias: [
                {
                    find: 'src',
                    replacement: path.resolve(__dirname, './src'),
                },
                // {
                //     find: '@stringeecom/ui-kit',
                //     replacement: path.resolve(__dirname, '../ui-kit')
                // },
                { find: /^~/, replacement: '' },
            ],
        },
        build: {
            assetsDir: '_app_name/assets',
            target: 'esnext',
            minify: true,
            cssMinify: true,
            cssCodeSplit: false,
            commonjsOptions: { transformMixedEsModules: true },
            rollupOptions: {
                external: [],
            },
        },
    };
});
