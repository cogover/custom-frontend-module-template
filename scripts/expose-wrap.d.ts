import type { Plugin } from 'vite';

export function wrapExposes(exposes: Record<string, string>): Record<string, string>;

export default function exposeWrap(exposes?: Record<string, string>): Plugin;
