import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetForm from '../reset-form';
import { RESET_FORM_DATA } from '../reset-form.data';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as firebaseModule from '~/utils/firebase/firebase';
import * as routerModule from 'react-router-dom';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('~/utils/firebase/firebase', () => ({
  auth: {},
  sendPasswordReset: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );
  return {
    ...actual,
    useNavigate: vi.fn(),
    Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('ResetForm', () => {
  let mockNavigate: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockNavigate = vi.fn();
    (routerModule.useNavigate as Mock).mockReturnValue(mockNavigate);

    (useAuthState as unknown as Mock).mockReturnValue([null, false, null]);

    render(
      <MemoryRouter>
        <ResetForm />
      </MemoryRouter>
    );
  });

  it('renders email input and submit button', () => {
    expect(
      screen.getByTestId(RESET_FORM_DATA.email['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /send password reset email/i })
    ).toBeInTheDocument();
  });

  it('shows validation error when email is empty', async () => {
    const emailInput = screen.getByTestId(RESET_FORM_DATA.email['data-testid']);

    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);

    fireEvent.click(
      screen.getByRole('button', { name: /send password reset email/i })
    );

    const error = await screen.findByText('Enter a valid email address');
    expect(error).toBeTruthy();
  });

  it('calls sendPasswordReset with correct email', async () => {
    const emailInput = screen.getByTestId(RESET_FORM_DATA.email['data-testid']);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    fireEvent.click(
      screen.getByRole('button', { name: /send password reset email/i })
    );

    await waitFor(() => {
      expect(firebaseModule.sendPasswordReset).toHaveBeenCalledWith(
        'test@example.com'
      );
    });
  });

  it('navigates to /welcome if user is already logged in', async () => {
    (useAuthState as unknown as Mock).mockReturnValue([
      { uid: '123' },
      false,
      null,
    ]);

    render(
      <MemoryRouter>
        <ResetForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/welcome');
    });
  });

  it('renders Sign Up link correctly', () => {
    const link = screen.getByText((text) => text.includes('Sign Up'));
    expect(link).toBeTruthy();
  });
});
