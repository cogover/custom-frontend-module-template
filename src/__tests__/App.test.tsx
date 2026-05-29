import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';

import { renderApp } from './testUtils.tsx';

describe('App', () => {
    it('Render App and check Error page', () => {
        renderApp('/abc');

        expect(screen.queryByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
    });
});
