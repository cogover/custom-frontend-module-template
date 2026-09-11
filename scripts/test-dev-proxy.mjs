import assert from 'node:assert/strict';
import { createServer as createHttpServer, request } from 'node:http';
import { once } from 'node:events';
import { test } from 'node:test';
import { createServer, loadConfigFromFile } from 'vite';

const configPath = new URL('../vite.config.ts', import.meta.url).pathname;

async function loadWorkspaceConfig(workspace, command = 'serve', environment = '') {
    const previous = process.env.VITE_WORKSPACE_NAME;
    const previousEnvironment = process.env.VITE_ENVIRONMENT;
    process.env.VITE_ENVIRONMENT = environment;
    process.env.VITE_WORKSPACE_NAME = workspace;
    try {
        const result = await loadConfigFromFile({ command, mode: 'development' }, configPath, undefined, 'silent');
        assert.ok(result);
        return result.config;
    } finally {
        if (previous === undefined) delete process.env.VITE_WORKSPACE_NAME;
        else process.env.VITE_WORKSPACE_NAME = previous;
        if (previousEnvironment === undefined) delete process.env.VITE_ENVIRONMENT;
        else process.env.VITE_ENVIRONMENT = previousEnvironment;
    }
}

async function startProxy(t, workspace, target, environment = '') {
    const config = await loadWorkspaceConfig(workspace, 'serve', environment);
    const proxy = Object.fromEntries(
        Object.entries(config.server.proxy).map(([path, options]) => [path, { ...options, target }]),
    );
    const server = await createServer({
        ...config,
        configFile: false,
        plugins: [],
        logLevel: 'silent',
        server: {
            ...config.server,
            host: '127.0.0.1',
            port: 55100,
            strictPort: false,
            https: undefined,
            open: false,
            hmr: false,
            proxy,
        },
    });
    t.after(() => server.close());
    await server.listen();
    return { server, origin: `http://127.0.0.1:${server.httpServer.address().port}` };
}

test('workspace configuration and real HTTP/WebSocket proxy isolation', async (t) => {
    await t.test('workspace validation and fixed production domain', async () => {
        for (const workspace of [
            '',
            '../other',
            'https://acme.cogover.com',
            'acme.cogover.net',
            '-acme',
            'a'.repeat(64),
        ]) {
            await assert.rejects(loadWorkspaceConfig(workspace), /VITE_WORKSPACE_NAME/);
        }
        const config = await loadWorkspaceConfig(' Acme-01 ');
        assert.equal(config.base, './');
        assert.equal(config.server.host, 'localhost');
        assert.equal(config.server.port, 5100);
        for (const options of Object.values(config.server.proxy)) {
            assert.equal(options.target, 'https://acme-01.cogover.com');
            assert.equal(options.secure, true);
        }
        assert.equal(config.server.proxy['/websocket'].ws, true);
        assert.equal(JSON.parse(config.define['import.meta.env.DEV_LOGIN_URL']), 'https://id.cogover.com/login');
        const alternate = await loadWorkspaceConfig('acme', 'serve', '.example.test');
        assert.equal(alternate.server.proxy['/api'].target, 'https://acme.example.test');
        assert.equal(JSON.parse(alternate.define['import.meta.env.DEV_LOGIN_URL']), 'https://id.example.test/login');
        await loadWorkspaceConfig('', 'build');
    });

    const upstream = createHttpServer((req, res) => {
        if (req.url === '/api/login') {
            res.setHeader('Set-Cookie', [
                'HttpSessionId=session-a; Domain=.cogover.com; Path=/; HttpOnly; Secure; SameSite=None',
                'XSRF-TOKEN=csrf-a; Domain=.cogover.com; Path=/; Secure',
            ]);
        }
        if (req.url === '/api/logout') {
            res.setHeader('Set-Cookie', 'HttpSessionId=; Domain=.cogover.com; Path=/; Max-Age=0; Secure; HttpOnly');
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ url: req.url, cookie: req.headers.cookie, csrf: req.headers['x-csrf-token'] }));
    });
    let upgradeHeaders;
    upstream.on('upgrade', (req, socket) => {
        upgradeHeaders = req.headers;
        socket.end('HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\n\r\n');
    });
    upstream.listen(0, '127.0.0.1');
    await once(upstream, 'listening');
    const target = `http://127.0.0.1:${upstream.address().port}`;
    t.after(async () => {
        upstream.closeAllConnections();
        await new Promise((resolve) => upstream.close(resolve));
    });
    const first = await startProxy(t, 'acme', target);
    const second = await startProxy(t, 'other', target);
    const alternate = await startProxy(t, 'acme', target, '.example.test');

    let loginCookies;
    await t.test('cookies become localhost cookies without losing security attributes', async () => {
        const response = await fetch(`${first.origin}/api/login`);
        assert.equal(response.status, 200);
        loginCookies = response.headers.getSetCookie();
        assert.equal(loginCookies.length, 2);
        assert.match(loginCookies[0], /^cgv_dev_acme_cogover.com__HttpSessionId=session-a;/);
        assert.match(loginCookies[0], /HttpOnly; Secure; SameSite=None/);
        assert.match(loginCookies[1], /^cgv_dev_acme_cogover.com__XSRF-TOKEN=csrf-a;/);
        assert.ok(loginCookies.every((cookie) => !/domain=/i.test(cookie)));
        await response.text();
    });

    const cookieHeader = () =>
        [
            ...loginCookies.map((cookie) => cookie.split(';')[0]),
            'HttpSessionId=legacy-session',
            'XSRF-TOKEN=legacy-csrf',
            'cgv_dev_other_cogover.com__HttpSessionId=session-b',
            'cgv_dev_other_cogover.com__XSRF-TOKEN=csrf-b',
        ].join('; ');

    await t.test('all HTTP paths preserve URL and only forward the selected session and CSRF', async () => {
        for (const path of ['/api/records?limit=2', '/files/report.pdf', '/static/example.css']) {
            const response = await fetch(`${first.origin}${path}`, {
                headers: { cookie: cookieHeader(), 'X-CSRF-TOKEN': 'legacy-csrf' },
            });
            assert.deepEqual(await response.json(), {
                url: path,
                cookie: 'HttpSessionId=session-a; XSRF-TOKEN=csrf-a',
                csrf: 'csrf-a',
            });
        }
        const response = await fetch(`${second.origin}/api/records`, { headers: { cookie: cookieHeader() } });
        assert.deepEqual(await response.json(), {
            url: '/api/records',
            cookie: 'HttpSessionId=session-b; XSRF-TOKEN=csrf-b',
            csrf: 'csrf-b',
        });
    });

    await t.test('same workspace in another environment does not reuse production cookies', async () => {
        const response = await fetch(`${alternate.origin}/api/login`, { headers: { cookie: cookieHeader() } });
        assert.deepEqual(await response.json(), { url: '/api/login' });
        assert.match(response.headers.getSetCookie()[0], /^cgv_dev_acme_example\.test__HttpSessionId=/);
    });

    await t.test('legacy and unrelated cookies are never forwarded', async () => {
        const response = await fetch(`${second.origin}/api/records`, {
            headers: {
                cookie: 'HttpSessionId=old; cgv_dev_acme_cogover.com__HttpSessionId=session-a',
                'X-CSRF-TOKEN': 'old',
            },
        });
        assert.deepEqual(await response.json(), { url: '/api/records' });
    });

    await t.test('logout expires only the selected workspace session', async () => {
        const response = await fetch(`${first.origin}/api/logout`);
        const cookie = response.headers.getSetCookie()[0];
        assert.match(cookie, /^cgv_dev_acme_cogover.com__HttpSessionId=;/);
        assert.match(cookie, /Max-Age=0/);
        assert.ok(!/domain=/i.test(cookie));
        await response.text();
    });

    await t.test('WebSocket handshake also isolates workspace cookies', async () => {
        await new Promise((resolve, reject) => {
            const req = request(`${first.origin}/websocket`, {
                headers: { Connection: 'Upgrade', Upgrade: 'websocket', cookie: cookieHeader() },
            });
            req.on('upgrade', (_res, socket) => {
                socket.destroy();
                resolve();
            });
            req.on('error', reject);
            req.setTimeout(5000, () => req.destroy(new Error('WebSocket upgrade timed out')));
            req.end();
        });
        assert.equal(upgradeHeaders.cookie, 'HttpSessionId=session-a; XSRF-TOKEN=csrf-a');
        assert.equal(upgradeHeaders['x-csrf-token'], 'csrf-a');
    });
});
