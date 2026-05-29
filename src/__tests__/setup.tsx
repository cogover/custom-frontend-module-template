import { expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

import * as matchers from '@testing-library/jest-dom/matchers';
import { server } from 'src/__mocks__/_server';
import 'vitest-canvas-mock';

expect.extend(matchers);

beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    cleanup();
});
afterAll(() => server.close());

server.events.on('request:start', ({ request }) => {
    console.log('MSW intercepted:', request.method, request.url);
});

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

Element.prototype.scrollIntoView = vi.fn();
