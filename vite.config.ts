import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd());

    const certKey = env.VITE_CERT_KEY_PATH ? fs.readFileSync(env.VITE_CERT_KEY_PATH) : '';
    const cert = env.VITE_CERT_PATH ? fs.readFileSync(env.VITE_CERT_PATH) : '';

    const hasCerts = !!certKey && !!cert;

    return {
        base: './',
        plugins: [
            react(),
            !hasCerts && basicSsl(),
            federation({
                name: 'cmTemplate', // ĐỔI khi clone, vd 'cm3'
                filename: 'remoteEntry.js',
                exposes: {
                    './CustomApp': './src/App.tsx',
                },
                shared: [
                    'react',
                    'react-dom',
                    'react-redux',
                    '@reduxjs/toolkit',
                    'react-router-dom',
                    '@tanstack/react-query',
                    'react-hook-form',
                    'yup',
                    'dayjs',
                ],
            }),
            // Chỉ lint khi dev (serve) — tránh xung đột với virtual module của federation lúc build.
            // Lint khi build/CI dùng riêng `npm run lint`.
            command === 'serve' &&
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
            port: 5100, // ĐỔI khi clone, vd 5103 cho cm3
            strictPort: true,
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
        // Preview phục vụ remoteEntry cho host fetch cross-origin → cần CORS
        preview: {
            port: 5101, // ĐỔI khi clone, vd 5103 cho cm3
            strictPort: true,
            cors: true,
            headers: { 'Access-Control-Allow-Origin': '*' },
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
                { find: /^~/, replacement: '' },
            ],
        },
        build: {
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
