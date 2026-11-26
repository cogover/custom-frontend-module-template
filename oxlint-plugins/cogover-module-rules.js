// Plugin JS cho Oxlint: thay `no-restricted-syntax` của ESLint cũ (Oxlint chưa có rule này) cho các quy tắc của custom module:
// - no-datetime-format-literal: không viết cứng định dạng ngày giờ.
// - no-host-internal: M1 (Chạy trên mobile) — không dùng kênh nội bộ giữa trang Cogover và ứng dụng mobile.
// - no-viewport-layout: M4 (Chạy trên mobile) — component trên layout không dùng chiều cao theo màn hình / position fixed.
// Giữ đúng phạm vi các selector cũ; test: scripts/test-lint-mobile-rules.mjs.

const DATE_TIME_FORMAT_PATTERN = /(YYYY|DD).*[Hh]{1,2}:mm/;
const DATE_TIME_FORMAT_MESSAGE =
    'Không viết cứng định dạng ngày giờ. Dùng useListDateTimeFormat() (src/hooks) theo cài đặt workspace, xem skill custom-module-list-page.';

export const HOST_INTERNAL_NAMES = [
    'CogoverWebView',
    'CogoverEmbed',
    'flutter_inappwebview',
    '__COGOVER_FEDERATION_HOST__',
];
export const HOST_INTERNAL_MESSAGE =
    'Đây là kênh nội bộ giữa trang Cogover và ứng dụng Cogover mobile, không được hỗ trợ cho module và có thể đổi ' +
    'bất kỳ lúc nào. Dùng thay: prop formBuilder của component (execScript, refreshRecordDetail, record, mode, ' +
    'objectSlug), useLibrary() cho cấu hình, Link/useNavigate của dự án cho điều hướng. ' +
    'Xem mục "Chạy trên mobile" trong skill custom-module-foundation.';

const VIEWPORT_LAYOUT_MESSAGE =
    'Component trên layout không dùng chiều cao theo màn hình (vh, h-screen) hay position fixed: khung chứa trên ứng dụng mobile ' +
    'co giãn theo nội dung nên sẽ cao mãi hoặc bị đè. Để nội dung tự co giãn; lớp phủ dùng Modal, Popper hoặc PopperMenu của @cogover/client-sdk.';
// Đơn vị theo màn hình và `position: fixed` viết trong chuỗi (style, class tuỳ ý `[position:fixed]`).
const VIEWPORT_UNIT_PATTERN = /\d(s|d|l)?vh\b|position:\s*fixed/;
// Class Tailwind `fixed`, `h-screen`… chỉ kiểm trong className và đối số hàm ghép class, tránh báo nhầm dữ liệu.
const VIEWPORT_CLASS_PATTERN = /(^|[\s:])(fixed|(min-h-|max-h-|h-)screen)(\s|$)/;
const CLASS_ATTRIBUTE = /^(className|class)$/;
const CLASS_FUNCTION = /^(cx|clsx|classNames|classnames|twMerge|cn)$/;

const isStringLiteral = (node) => node.type === 'Literal' && typeof node.value === 'string';
const propertyName = (key) => (key?.type === 'Identifier' ? key.name : key?.type === 'Literal' ? key.value : undefined);

const isClassFunctionCall = (node) =>
    node.type === 'CallExpression' && node.callee.type === 'Identifier' && CLASS_FUNCTION.test(node.callee.name);
const isClassAttribute = (node) =>
    node.type === 'JSXAttribute' && node.name.type === 'JSXIdentifier' && CLASS_ATTRIBUTE.test(node.name.name);

// Có tổ tiên là className/class hoặc lời gọi hàm ghép class (giống selector hậu duệ `context X` của ESLint).
const inClassContext = (node) => {
    for (let current = node.parent; current; current = current.parent) {
        if (isClassAttribute(current) || isClassFunctionCall(current)) return true;
    }
    return false;
};

const noDatetimeFormatLiteral = {
    meta: { type: 'problem', docs: { description: 'Không viết cứng định dạng ngày giờ' } },
    create(context) {
        return {
            Literal(node) {
                if (isStringLiteral(node) && DATE_TIME_FORMAT_PATTERN.test(node.value)) {
                    context.report({ node, message: DATE_TIME_FORMAT_MESSAGE });
                }
            },
            TemplateElement(node) {
                if (DATE_TIME_FORMAT_PATTERN.test(node.value.raw))
                    context.report({ node, message: DATE_TIME_FORMAT_MESSAGE });
            },
        };
    },
};

const noHostInternal = {
    meta: {
        type: 'problem',
        docs: { description: 'M1: không dùng kênh nội bộ giữa trang Cogover và ứng dụng mobile' },
    },
    create(context) {
        const isInternal = (name) => typeof name === 'string' && HOST_INTERNAL_NAMES.includes(name);
        return {
            MemberExpression(node) {
                const name = node.property.type === 'Identifier' ? node.property.name : node.property.value;
                if (isInternal(name)) context.report({ node, message: HOST_INTERNAL_MESSAGE });
            },
            // Lấy ra bằng destructuring: `const { CogoverWebView } = window`.
            Property(node) {
                if (node.parent?.type === 'ObjectPattern' && isInternal(propertyName(node.key))) {
                    context.report({ node, message: HOST_INTERNAL_MESSAGE });
                }
            },
        };
    },
};

const noViewportLayout = {
    meta: {
        type: 'problem',
        docs: { description: 'M4: component trên layout không dùng vh, h-screen, position fixed' },
    },
    create(context) {
        const report = (node) => context.report({ node, message: VIEWPORT_LAYOUT_MESSAGE });
        // Bỏ qua chuỗi dùng để so sánh (`type === 'fixed'`) và giá trị điều kiện trong object của cx().
        const isClassValue = (node) =>
            !(node.parent?.type === 'BinaryExpression') &&
            !(node.parent?.type === 'Property' && node.parent.value === node);
        return {
            Literal(node) {
                if (!isStringLiteral(node)) return;
                if (VIEWPORT_UNIT_PATTERN.test(node.value)) return report(node);
                if (VIEWPORT_CLASS_PATTERN.test(node.value) && isClassValue(node) && inClassContext(node)) report(node);
            },
            TemplateElement(node) {
                const raw = node.value.raw;
                if (VIEWPORT_UNIT_PATTERN.test(raw)) return report(node);
                if (VIEWPORT_CLASS_PATTERN.test(raw) && inClassContext(node)) report(node);
            },
            Property(node) {
                // Khoá class dạng định danh trong object của cx(): `cx({ fixed: open })`.
                if (node.key.type === 'Identifier' && node.key.name === 'fixed' && !node.computed) {
                    for (let current = node.parent; current; current = current.parent) {
                        if (isClassFunctionCall(current)) return report(node.key);
                    }
                }
                if (
                    propertyName(node.key) === 'position' &&
                    isStringLiteral(node.value) &&
                    node.value.value === 'fixed'
                ) {
                    report(node);
                }
            },
        };
    },
};

export default {
    meta: { name: 'cogover' },
    rules: {
        'no-datetime-format-literal': noDatetimeFormatLiteral,
        'no-host-internal': noHostInternal,
        'no-viewport-layout': noViewportLayout,
    },
};
