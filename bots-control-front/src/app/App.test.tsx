import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from './store/store';
import App from './App';

vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('App routing smoke', () => {
  it('renders login form when not authenticated', async () => {
    sessionStorage.removeItem('bots-control-auth-user');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.findByText(/Crypto Arbitrage/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Login|Логин/i)).toBeInTheDocument();
  });
});
