import react from '@vitejs/plugin-react-swc';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import eslintPlugin from 'vite-plugin-eslint';
import path from 'path';
import { defineConfig, loadEnv, ProxyOptions } from 'vite';
import type { ClientRequest, IncomingMessage } from 'node:http';
import federation from '@originjs/vite-plugin-federation';
import federationDev from './scripts/federation-dev.js';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd());

    const workspaceName = (env.VITE_WORKSPACE_NAME ?? '').trim().toLowerCase();
    const validWorkspace = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(workspaceName);
    if (command === 'serve' && !validWorkspace) {
        throw new Error('Đặt VITE_WORKSPACE_NAME trong .env.local thành tên workspace, ví dụ: cong-ty.');
    }

    const siteDomain = (env.VITE_ENVIRONMENT?.trim() || 'cogover.com').replace(/^\./, '').toLowerCase();
    const workspaceOrigin = `https://${workspaceName}.${siteDomain}`;
    const cookiePrefix = `cgv_dev_${workspaceName}_${siteDomain}__`;

    // Chỉ chuyển cookie của workspace hiện tại; không dùng phiên localhost của workspace khác.
    const forwardWorkspaceCookies = (proxyReq: ClientRequest, req: IncomingMessage) => {
        const cookies = (req.headers.cookie ?? '')
            .split(';')
            .map((cookie) => cookie.trim())
            .filter((cookie) => cookie.startsWith(cookiePrefix))
            .map((cookie) => cookie.slice(cookiePrefix.length));

        proxyReq.removeHeader('cookie');
        proxyReq.removeHeader('X-CSRF-TOKEN');
        if (cookies.length) proxyReq.setHeader('cookie', cookies.join('; '));
        const csrfCookie = cookies.find((cookie) => cookie.startsWith('XSRF-TOKEN='));
        if (csrfCookie) proxyReq.setHeader('X-CSRF-TOKEN', csrfCookie.slice('XSRF-TOKEN='.length));
    };

    const workspaceProxy: ProxyOptions = {
        target: workspaceOrigin,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: '',
        configure(proxy) {
            proxy.on('proxyReq', forwardWorkspaceCookies);
            proxy.on('proxyReqWs', forwardWorkspaceCookies);
            proxy.on('proxyRes', (response) => {
                const cookies = response.headers['set-cookie'];
                if (cookies) {
                    response.headers['set-cookie'] = cookies.map((cookie) => `${cookiePrefix}${cookie}`);
                }
            });
        },
    };

    const exposes = {
        './CustomApp': './src/App.tsx',
        './Components/DemoCounter': './src/components/DemoCounter.tsx',
    };

    return {
        base: './',
        define: { 'import.meta.env.DEV_LOGIN_URL': JSON.stringify(`https://id.${siteDomain}/login`) },
        plugins: [
            react(),
            federation({
                name: 'customModule',
                filename: 'remoteEntry.js',
                exposes,
                shared: [
                    '@cogover/client-sdk',
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
            federationDev(exposes),
        ].filter(Boolean),
        server: {
            host: 'localhost',
            port: 5100,
            strictPort: true,
            open: true,
            proxy: {
                '/api': workspaceProxy,
                '/files': workspaceProxy,
                '/websocket': { ...workspaceProxy, ws: true },
                '/static': workspaceProxy,
            },
        },
        // Preview dùng HTTP localhost để tải remoteEntry mà không cần chứng chỉ HTTPS.
        preview: {
            host: 'localhost',
            port: 5101,
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
