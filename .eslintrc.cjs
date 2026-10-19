/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

// Ngày giờ hiển thị theo cài đặt workspace; không viết cứng chuỗi kiểu 'DD/MM/YYYY HH:mm'.
const DATE_TIME_FORMAT_SYNTAX = [
    {
        selector: 'Literal[value=/(YYYY|DD).*[Hh]{1,2}:mm/]',
        message:
            'Không viết cứng định dạng ngày giờ. Dùng useListDateTimeFormat() (src/hooks) theo cài đặt workspace, xem skill custom-module-list-page.',
    },
    {
        selector: 'TemplateElement[value.raw=/(YYYY|DD).*[Hh]{1,2}:mm/]',
        message:
            'Không viết cứng định dạng ngày giờ. Dùng useListDateTimeFormat() (src/hooks) theo cài đặt workspace, xem skill custom-module-list-page.',
    },
];

// M1 (Chạy trên mobile): các tên dưới đây là kênh nội bộ giữa trang Cogover nhúng module và ứng dụng Cogover mobile
// (cầu nối WebView). Nền tảng dùng chúng để tự chuyển formBuilder, cấu hình và điều hướng qua lại với ứng dụng;
// định dạng tin nhắn có thể đổi theo phiên bản ứng dụng và không có trên web. Module gọi thẳng
// sẽ chạy sai hoặc hỏng khi ứng dụng cập nhật, nên chặn từ lúc viết code và chỉ cho đi qua hợp đồng công khai.
const HOST_INTERNAL_NAMES = ['CogoverWebView', 'CogoverEmbed', 'flutter_inappwebview', '__COGOVER_FEDERATION_HOST__'];
const HOST_INTERNAL_MESSAGE =
    'Đây là kênh nội bộ giữa trang Cogover và ứng dụng Cogover mobile, không được hỗ trợ cho module và có thể đổi ' +
    'bất kỳ lúc nào. Dùng thay: prop formBuilder của component (execScript, refreshRecordDetail, record, mode, ' +
    'objectSlug), useLibrary() cho cấu hình, Link/useNavigate của dự án cho điều hướng. ' +
    'Xem mục "Chạy trên mobile" trong skill custom-module-foundation.';
const HOST_INTERNAL_PATTERN = `/^(${HOST_INTERNAL_NAMES.join('|')})$/`;
const HOST_INTERNAL_SYNTAX = [
    { selector: `MemberExpression[property.name=${HOST_INTERNAL_PATTERN}]`, message: HOST_INTERNAL_MESSAGE },
    { selector: `MemberExpression[property.value=${HOST_INTERNAL_PATTERN}]`, message: HOST_INTERNAL_MESSAGE },
    // Lấy ra bằng destructuring: `const { CogoverWebView } = window`.
    { selector: `ObjectPattern > Property[key.name=${HOST_INTERNAL_PATTERN}]`, message: HOST_INTERNAL_MESSAGE },
    { selector: `ObjectPattern > Property[key.value=${HOST_INTERNAL_PATTERN}]`, message: HOST_INTERNAL_MESSAGE },
];

// M5 (Chạy trên mobile): hộp thoại và lệnh in của trình duyệt không hoạt động như trên web khi chạy trong ứng dụng mobile.
const BROWSER_DIALOG_MESSAGES = {
    alert: 'Không dùng alert: hộp thoại trình duyệt không hiển thị như trên web trong ứng dụng mobile. Thông báo bằng showToastMessage hoặc Modal của @cogover/client-sdk.',
    confirm:
        'Không dùng confirm: hộp thoại trình duyệt không hiển thị như trên web trong ứng dụng mobile. Hỏi xác nhận bằng ConfirmModal của @cogover/client-sdk.',
    prompt: 'Không dùng prompt: hộp thoại trình duyệt không hiển thị như trên web trong ứng dụng mobile. Nhập liệu bằng Modal có ô nhập của @cogover/client-sdk.',
    print: 'Không dùng window.print: ứng dụng mobile không in được trang. Xuất file (PDF, Excel) qua API rồi tải bằng link tải.',
};
const BROWSER_DIALOG_GLOBALS = Object.entries(BROWSER_DIALOG_MESSAGES).map(([name, message]) => ({ name, message }));
const BROWSER_DIALOG_PROPERTIES = ['window', 'globalThis', 'self'].flatMap((object) =>
    Object.entries(BROWSER_DIALOG_MESSAGES).map(([property, message]) => ({ object, property, message })),
);

// M4 (Chạy trên mobile): component trên layout tự co giãn theo nội dung; chiều cao theo màn hình hoặc phần tử
// cố định làm khung chứa cao mãi hoặc đè lên giao diện của ứng dụng mobile. Chỉ áp cho src/components.
const VIEWPORT_LAYOUT_MESSAGE =
    'Component trên layout không dùng chiều cao theo màn hình (vh, h-screen) hay position fixed: khung chứa trên ứng dụng mobile ' +
    'co giãn theo nội dung nên sẽ cao mãi hoặc bị đè. Để nội dung tự co giãn; lớp phủ dùng Modal, Popper hoặc PopperMenu của @cogover/client-sdk.';
// Đơn vị theo màn hình và `position: fixed` viết trong chuỗi (style, class tuỳ ý `[position:fixed]`).
const VIEWPORT_UNIT_PATTERN = '/\\d(s|d|l)?vh\\b|position:\\s*fixed/';
// Class Tailwind `fixed`, `h-screen`… chỉ kiểm trong className và đối số hàm ghép class, tránh báo nhầm dữ liệu
// như `type === 'fixed'`. Bỏ qua chuỗi dùng để so sánh và giá trị điều kiện trong object của cx().
const VIEWPORT_CLASS_PATTERN = '/(^|[\\s:])(fixed|(min-h-|max-h-|h-)screen)(\\s|$)/';
const CLASS_CONTEXTS = [
    'JSXAttribute[name.name=/^(className|class)$/]',
    'CallExpression[callee.name=/^(cx|clsx|classNames|classnames|twMerge|cn)$/]',
];
const NOT_CLASS_VALUE = ':not(BinaryExpression > Literal):not(Property > Literal.value)';
const VIEWPORT_LAYOUT_SYNTAX = [
    { selector: `Literal[value=${VIEWPORT_UNIT_PATTERN}]`, message: VIEWPORT_LAYOUT_MESSAGE },
    { selector: `TemplateElement[value.raw=${VIEWPORT_UNIT_PATTERN}]`, message: VIEWPORT_LAYOUT_MESSAGE },
    ...CLASS_CONTEXTS.flatMap((context) => [
        {
            selector: `${context} Literal[value=${VIEWPORT_CLASS_PATTERN}]${NOT_CLASS_VALUE}`,
            message: VIEWPORT_LAYOUT_MESSAGE,
        },
        {
            selector: `${context} TemplateElement[value.raw=${VIEWPORT_CLASS_PATTERN}]`,
            message: VIEWPORT_LAYOUT_MESSAGE,
        },
    ]),
    // Khoá class dạng định danh trong object của cx(): `cx({ fixed: open })`.
    {
        selector: `${CLASS_CONTEXTS[1]} Property > Identifier.key[name='fixed']`,
        message: VIEWPORT_LAYOUT_MESSAGE,
    },
    {
        selector: "Property[key.name='position'][value.value='fixed']",
        message: VIEWPORT_LAYOUT_MESSAGE,
    },
];

module.exports = {
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
    },
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@tanstack/eslint-plugin-query/recommended',
        'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    settings: {
        react: {
            // Nói eslint-plugin-react tự động biết version của React.
            version: 'detect',
        },
        // Nói ESLint cách xử lý các import
        'import/resolver': {
            node: {
                paths: [path.resolve(__dirname)],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        indent: [0, 4, { SwitchCase: 1 }],
        'max-len': [
            'warn',
            {
                code: 120,
            },
        ],
        'comma-dangle': ['warn', 'never'],
        'require-jsdoc': 0,
        quotes: ['off', 'double'],
        'comma-dangle': ['off'],
        'no-trailing-spaces': [
            'off',
            {
                skipBlankLines: true,
            },
        ],
        // Cấm dùng FontAwesome trong custom module này. Icon lấy từ @cogover/client-sdk hoặc asset SVG thuộc dự án.
        '@typescript-eslint/no-restricted-imports': [
            'error',
            {
                patterns: [
                    {
                        group: ['@fortawesome', '@fortawesome/*'],
                    },
                    {
                        // M1 (Chạy trên mobile): gói giao thức nội bộ giữa trang Cogover và ứng dụng mobile, chỉ nền
                        // tảng dùng; module dùng @cogover/client-sdk gốc (useLibrary) thay thế.
                        group: ['@cogover/client-sdk/embed-bridge', '@cogover/client-sdk/embed-bridge/*'],
                        message: HOST_INTERNAL_MESSAGE,
                    },
                ],
            },
        ],
        'no-restricted-syntax': ['error', ...DATE_TIME_FORMAT_SYNTAX, ...HOST_INTERNAL_SYNTAX],
        'no-restricted-globals': [
            'error',
            ...HOST_INTERNAL_NAMES.map((name) => ({ name, message: HOST_INTERNAL_MESSAGE })),
            ...BROWSER_DIALOG_GLOBALS,
        ],
        'no-restricted-properties': ['error', ...BROWSER_DIALOG_PROPERTIES],
        '@typescript-eslint/no-unused-vars': ['warn'],
        '@typescript-eslint/prefer-nullish-coalescing': ['off'],
        '@typescript-eslint/no-misused-promises': ['off'],
        'react/display-name': ['off'],
    },
    overrides: [
        {
            files: ['src/components/**/*.{ts,tsx}'],
            rules: {
                'no-restricted-syntax': [
                    'error',
                    ...DATE_TIME_FORMAT_SYNTAX,
                    ...HOST_INTERNAL_SYNTAX,
                    ...VIEWPORT_LAYOUT_SYNTAX,
                ],
            },
        },
    ],
};
