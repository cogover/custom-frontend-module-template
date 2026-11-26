import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));
const projectConfig = JSON.parse(readFileSync(join(root, '.oxlintrc.json'), 'utf8'));
// Chỉ kiểm các quy tắc "Chạy trên mobile" (M1, M4, M5) và các quy tắc chặn đi kèm, không cần thông tin kiểu của TypeScript.
const RESTRICTED_RULES = [
    'no-restricted-globals',
    'no-restricted-properties',
    'no-restricted-imports',
    'cogover/no-datetime-format-literal',
    'cogover/no-host-internal',
];
const lintConfig = {
    plugins: ['eslint', 'typescript'],
    jsPlugins: [join(root, 'oxlint-plugins/cogover-module-rules.js')],
    categories: { correctness: 'off' },
    env: { browser: true, es2020: true },
    rules: Object.fromEntries(RESTRICTED_RULES.map((name) => [name, projectConfig.rules[name]])),
    overrides: projectConfig.overrides,
};

function lintLines(code, filePath = 'src/components/Probe.tsx') {
    const dir = mkdtempSync(join(tmpdir(), 'cgv-lint-'));
    try {
        mkdirSync(join(dir, dirname(filePath)), { recursive: true });
        writeFileSync(join(dir, filePath), code);
        writeFileSync(join(dir, '.oxlintrc.json'), JSON.stringify(lintConfig));
        let output;
        try {
            output = execFileSync(
                join(root, 'node_modules/.bin/oxlint'),
                ['-c', '.oxlintrc.json', '-f', 'json', 'src'],
                {
                    cwd: dir,
                    encoding: 'utf8',
                },
            );
        } catch (error) {
            // oxlint thoát mã khác 0 khi có lỗi; kết quả vẫn ở stdout.
            output = error.stdout;
        }
        const { diagnostics } = JSON.parse(output);
        // Mỗi dòng mẫu là một trường hợp; một dòng có thể khớp nhiều quy tắc nên chỉ lấy danh sách dòng bị báo.
        return [...new Set(diagnostics.flatMap((item) => item.labels.map((label) => label.span.line)))].sort(
            (a, b) => a - b,
        );
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
}

test('M1: chặn kênh nội bộ của trang nhúng và ứng dụng mobile', () => {
    const lines = lintLines(
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

test('M5: chặn hộp thoại và lệnh in của trình duyệt', () => {
    const lines = lintLines(
        ["alert('a');", "window.confirm('b');", "globalThis.prompt('c');", 'window.print();', "self.alert('d');"].join(
            '\n',
        ),
        'src/pages/Probe.tsx',
    );
    assert.deepEqual(lines, [1, 2, 3, 4, 5]);
});

test('M4: chặn chiều cao theo màn hình và position fixed trong src/components', () => {
    const lines = lintLines(
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

test('M4: không báo nhầm dữ liệu có chữ fixed hoặc screen', () => {
    const lines = lintLines(
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

test('M4: không áp cho trang (Custom Page toàn màn hình)', () => {
    const lines = lintLines("const a = <div className='fixed min-h-[calc(100svh-3.5rem)]' />;", 'src/pages/Probe.tsx');
    assert.deepEqual(lines, []);
});
