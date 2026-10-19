import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { ESLint } from 'eslint';

const require = createRequire(import.meta.url);
const projectConfig = require('../.eslintrc.cjs');
const RESTRICTED_RULES = ['no-restricted-syntax', 'no-restricted-globals', 'no-restricted-properties'];
const pickRestricted = (rules) =>
    Object.fromEntries(RESTRICTED_RULES.filter((name) => rules[name]).map((name) => [name, rules[name]]));

// Chỉ kiểm các quy tắc "Chạy trên mobile" (M1, M4, M5), không cần thông tin kiểu của TypeScript.
const eslint = new ESLint({
    cwd: new URL('..', import.meta.url).pathname,
    useEslintrc: false,
    overrideConfig: {
        root: true,
        parser: '@typescript-eslint/parser',
        parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
        env: { browser: true, es2020: true },
        rules: {
            ...pickRestricted(projectConfig.rules),
            '@typescript-eslint/no-restricted-imports': projectConfig.rules['@typescript-eslint/no-restricted-imports'],
        },
        plugins: ['@typescript-eslint'],
        overrides: projectConfig.overrides.map(({ files, rules }) => ({ files, rules: pickRestricted(rules) })),
    },
});

async function lintLines(code, filePath = 'src/components/Probe.tsx') {
    const [result] = await eslint.lintText(code, { filePath });
    // Mỗi dòng mẫu là một trường hợp; một dòng có thể khớp nhiều selector nên chỉ lấy danh sách dòng bị báo.
    return [...new Set(result.messages.map((message) => message.line))];
}

test('M1: chặn kênh nội bộ của trang nhúng và ứng dụng mobile', async () => {
    const lines = await lintLines(
        [
            "import { x } from '@cogover/client-sdk/embed-bridge';",
            '(window as any).CogoverWebView.postMessage(x);',
            "(window as any)['flutter_inappwebview'].callHandler();",
            '(globalThis as any).CogoverEmbed;',
            '(window as any).__COGOVER_FEDERATION_HOST__;',
            'const { CogoverWebView } = window as any;',
            "const { ['flutter_inappwebview']: bridge } = window as any;",
            'const { CogoverEmbed: embed = null } = window as any;',
            "const { 'CogoverWebView': webView } = window as any;",
            'const { __COGOVER_FEDERATION_HOST__: host } = globalThis as any;',
        ].join('\n'),
        'src/pages/Probe.tsx',
    );
    assert.deepEqual(lines, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test('M5: chặn hộp thoại và lệnh in của trình duyệt', async () => {
    const lines = await lintLines(
        ["alert('a');", "window.confirm('b');", "globalThis.prompt('c');", 'window.print();', "self.alert('d');"].join(
            '\n',
        ),
        'src/pages/Probe.tsx',
    );
    assert.deepEqual(lines, [1, 2, 3, 4, 5]);
});

test('M4: chặn chiều cao theo màn hình và position fixed trong src/components', async () => {
    const lines = await lintLines(
        [
            "const style = { position: 'fixed', height: '100vh' };",
            'const top = 56;',
            'const a = <div className={`h-[calc(100dvh-${top}px)]`} />;',
            "const b = <div className='md:h-screen' />;",
            "const c = <div className='inset-0 fixed' />;",
            "const d = <div className='[position:fixed] min-h-screen' />;",
            "const e = <div className={cx('fixed', { 'md:fixed': open })} />;",
            "const f = clsx('max-h-screen');",
            'const g = twMerge(`fixed ${extra}`);',
            "const h = 'position: fixed';",
            "const i = <div className={open ? 'fixed inset-0' : 'relative'} />;",
            "const j = <div className={cx(open && 'fixed', `${base} h-screen`)} />;",
            'const k = <div className={`fixed ${extra}`} />;',
            'const l = cx({ fixed: open });',
        ].join('\n'),
    );
    assert.deepEqual(lines, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
});

test('M4: không báo nhầm dữ liệu có chữ fixed hoặc screen', async () => {
    const lines = await lintLines(
        [
            "const isFixed = type === 'fixed';",
            "const discount = { discount: 'fixed' };",
            "const label = 'Giá cố định fixed price';",
            "const mode = 'h-screen';",
            "const p = <p className='prefixed suffix-fixed' title='fixed'>Giá fixed</p>;",
            "const q = cx('flex', { 'text-typo-secondary': value === 'fixed' });",
            "const r = <div className={type === 'fixed' ? 'text-primary-main' : ''} />;",
            "const s = cx('flex', { 'font-bold': mode !== 'fixed', 'text-typo-secondary': 'fixed' });",
            "switch (type) { case 'fixed': break; }",
            "const u = { fixed: true, kind: 'fixed' };",
        ].join('\n'),
    );
    assert.deepEqual(lines, []);
});

test('M4: không áp cho trang (Custom Page toàn màn hình)', async () => {
    const lines = await lintLines(
        "const a = <div className='fixed min-h-[calc(100svh-3.5rem)]' />;",
        'src/pages/Probe.tsx',
    );
    assert.deepEqual(lines, []);
});
