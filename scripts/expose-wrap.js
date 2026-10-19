import path from 'node:path';

// Component expose `./Components/*` không đi qua `App`, nên được build qua một module ảo bọc provider của module.
const PREFIX = 'virtual:cgv-expose/';
const RESOLVED_PREFIX = `\0${PREFIX}`;
const WRAPPER = 'src/providers/withExposeProviders.tsx';

/**
 * Trả về `exposes` cho Module Federation: mỗi `./Components/*` trỏ sang module ảo bọc `withExposeProviders`;
 * `./CustomApp` giữ nguyên vì `App` đã tự bọc provider.
 * @param {Record<string, string>} exposes
 */
export function wrapExposes(exposes) {
    return Object.fromEntries(
        Object.entries(exposes).map(([name, file]) => [
            name,
            name.startsWith('./Components/') ? `${PREFIX}${file.replace(/^\.\//, '')}` : file,
        ]),
    );
}

/**
 * Plugin tạo module ảo; `api.exposes` là `exposes` đã bọc để truyền cho Module Federation (test cũng đọc từ đây).
 * @param {Record<string, string>} exposes
 * @returns {import('vite').Plugin}
 */
export default function exposeWrap(exposes = {}) {
    let root = process.cwd();

    return {
        name: 'cgv-expose-wrap',
        api: { exposes: wrapExposes(exposes) },
        enforce: 'pre',
        configResolved(config) {
            root = config.root;
        },
        resolveId(id) {
            const index = id.indexOf(PREFIX);
            if (index !== -1) return `${RESOLVED_PREFIX}${id.slice(index + PREFIX.length)}`;
        },
        load(id) {
            if (!id.startsWith(RESOLVED_PREFIX)) return;
            const file = path.resolve(root, id.slice(RESOLVED_PREFIX.length));
            return [
                `import Component from ${JSON.stringify(file)};`,
                `import withExposeProviders from ${JSON.stringify(path.resolve(root, WRAPPER))};`,
                'export default withExposeProviders(Component);',
            ].join('\n');
        },
    };
}
