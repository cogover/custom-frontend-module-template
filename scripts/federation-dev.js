import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {Record<string, string>} exposes
 * @returns {import('vite').Plugin}
 */
export default function federationDev(exposes = {}) {
    let revisionFile;
    let watchBuild = false;

    return {
        name: 'cogover-federation-dev',
        enforce: 'post',
        configResolved(config) {
            revisionFile = path.join(config.root, '.federation-dev.local');
            watchBuild = Boolean(config.build.watch);
        },
        // Run after the output and preceding writeBundle hooks have completed successfully.
        writeBundle: {
            order: 'post',
            sequential: true,
            async handler() {
                if (!watchBuild) return;
                const temporaryFile = `${revisionFile}.${process.pid}.local`;
                await writeFile(temporaryFile, randomUUID());
                await rename(temporaryFile, revisionFile);
            },
        },
        configurePreviewServer(server) {
            const printUrls = server.printUrls.bind(server);
            server.printUrls = () => {
                printUrls();
                const urls = server.resolvedUrls;
                const origins = urls ? [...urls.local, ...urls.network] : [];
                const links = origins.flatMap((origin) =>
                    Object.keys(exposes)
                        .filter((name) => name !== './CustomApp')
                        .map((name) => {
                            const url = new URL(origin);
                            url.hash = name;
                            return `  ${name.replace(/^\.\//, '')}\n       -> ${url.href}`;
                        }),
                );
                if (links.length) server.config.logger.info(`\n  Federation components:\n${links.join('\n')}`);
            };

            const clients = new Set();
            let revision = '';
            const readRevision = () => {
                try {
                    return readFileSync(revisionFile, 'utf8').trim();
                } catch {
                    return '';
                }
            };
            const send = (response, value) => response.write(`data: ${JSON.stringify({ revision: value })}\n\n`);
            const poll = setInterval(() => {
                const next = readRevision();
                if (!next || next === revision) return;
                revision = next;
                for (const response of clients) send(response, revision);
            }, 250);
            const heartbeat = setInterval(() => {
                for (const response of clients) response.write(': heartbeat\n\n');
            }, 15000);
            poll.unref();
            heartbeat.unref();
            server.httpServer.once('close', () => {
                clearInterval(poll);
                clearInterval(heartbeat);
                for (const response of clients) response.end();
                clients.clear();
            });
            server.middlewares.use((request, response, next) => {
                if (request.url?.split('?')[0] !== '/__federation_dev/events') return next();
                response.setHeader('Access-Control-Allow-Origin', '*');
                if (request.method !== 'GET') {
                    response.writeHead(405, { Allow: 'GET' }).end();
                    return;
                }
                response.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache, no-transform',
                    Connection: 'keep-alive',
                    'X-Accel-Buffering': 'no',
                });
                response.flushHeaders();
                clients.add(response);
                // Refresh from disk so connecting before the next poll still receives the latest build.
                const latest = readRevision();
                if (latest) send(response, latest);
                response.on('close', () => clients.delete(response));
            });
        },
    };
}
