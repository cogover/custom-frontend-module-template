import assert from 'node:assert/strict';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { createServer, loadConfigFromFile } from 'vite';
import exposeWrap from './expose-wrap.js';

const root = path.resolve(new URL('..', import.meta.url).pathname);
let server;
let exposes;

// Template không cài môi trường DOM cho test; dựng tối thiểu phần HTTP client cần khi import.
const storage = new Map();
globalThis.window ??= globalThis;
globalThis.location ??= new URL('http://localhost:5100/');
globalThis.document ??= { cookie: '' };
globalThis.sessionStorage ??= {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
};

before(async () => {
    // Đọc đúng `exposes` đã bọc trong vite.config.ts để component mới thêm vào cũng được kiểm.
    const loaded = await loadConfigFromFile({ command: 'build', mode: 'production' }, undefined, root, 'silent');
    const plugins = (loaded?.config.plugins ?? []).flat();
    exposes = plugins.find((plugin) => plugin?.name === 'cgv-expose-wrap')?.api.exposes;
    assert.ok(exposes, 'vite.config.ts phải dùng plugin cgv-expose-wrap');

    server = await createServer({
        root,
        configFile: false,
        logLevel: 'silent',
        appType: 'custom',
        server: { middlewareMode: true, hmr: false },
        optimizeDeps: { noDiscovery: true, include: [] },
        // Gói CommonJS dùng named import trong src: đóng gói trước sang ESM như khi build.
        ssr: {
            noExternal: ['lodash', 'object-path', '@cogover/client-sdk'],
            optimizeDeps: { include: ['lodash', 'object-path'] },
        },
        plugins: [
            exposeWrap(),
            {
                // Code module chỉ dùng provider của `@cogover/client-sdk` (LibraryProvider, useLibrary); trỏ gói gốc
                // sang entry provider để Node không phải nạp phần giao diện cần DOM thật.
                name: 'test-client-sdk-provider',
                enforce: 'pre',
                resolveId(id) {
                    if (id === '@cogover/client-sdk') {
                        return path.join(root, 'node_modules/@cogover/client-sdk/dist/provider.js');
                    }
                },
            },
        ],
        resolve: {
            alias: [{ find: /^src\//, replacement: `${path.join(root, 'src')}/` }],
        },
    });
});

after(() => server?.close());

// Component expose không đi qua `App` nên host không truyền `appSlug`; request vẫn phải mang app slug của host.
test('component ./Components/* gửi X-App-Slug theo LibraryProvider khi không có prop appSlug', async () => {
    const React = await import('react');
    const { renderToString } = await import('react-dom/server');
    const { LibraryProvider } = await server.ssrLoadModule('@cogover/client-sdk');
    const { default: http } = await server.ssrLoadModule('/src/apis/apiBase.ts');

    const components = Object.entries(exposes).filter(([name]) => name.startsWith('./Components/'));
    assert.ok(components.length > 0);
    for (const [name, id] of components) {
        const { default: Exposed } = await server.ssrLoadModule(id.replace(/^\.\//, '/'));
        renderToString(
            React.createElement(
                LibraryProvider,
                {
                    locale: 'vi-VN',
                    themeMode: 'light',
                    workspaceId: 'ws',
                    appSlug: 'sales',
                    http,
                    queryHooks: {},
                },
                React.createElement(Exposed),
            ),
        );

        let headers;
        await http.get('/api/v1/ping', {
            adapter: async (config) => {
                headers = config.headers;
                return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
            },
        });
        assert.equal(headers.get('X-App-Slug'), 'sales', name);
    }
});
