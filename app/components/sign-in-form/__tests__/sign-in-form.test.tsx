import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  MemoryRouter,
  type LinkProps,
  useNavigate as useNavigateOriginal,
} from 'react-router';
import { SignInForm } from '../sign-in-form';
import { SIGN_IN_FORM_DATA } from '../sign-in-form.data';
import { useAuthState } from 'react-firebase-hooks/auth';
import React from 'react';

const mockNavigate = vi.fn();

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('~/lib/firebase/firebase', () => ({
  auth: {},
  signInWithEmailPassword: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: LinkProps) => (
      <a href={typeof to === 'string' ? to : ''}>{children}</a>
    ),
  };
});

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthState as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      null,
      false,
      null,
    ]);

    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );
  });

  it('renders form fields and submit button', () => {
    expect(
      screen.getByTestId(SIGN_IN_FORM_DATA.email['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SIGN_IN_FORM_DATA.password['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SIGN_IN_FORM_DATA.submit['data-testid'])
    ).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    const emailInput = screen.getByTestId(
      SIGN_IN_FORM_DATA.email['data-testid']
    );
    const passwordInput = screen.getByTestId(
      SIGN_IN_FORM_DATA.password['data-testid']
    );

    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    fireEvent.click(
      screen.getByTestId(SIGN_IN_FORM_DATA.submit['data-testid'])
    );

    expect(
      await screen.findByText(/Enter a valid email address/i)
    ).toBeTruthy();
    expect(
      await screen.findByText(/Password must be at least 8 characters/i)
    ).toBeTruthy();
  });

  it('calls signInWithEmailPassword with correct data', async () => {
    const { signInWithEmailPassword } = await import('~/lib/firebase/firebase');

    fireEvent.change(
      screen.getByTestId(SIGN_IN_FORM_DATA.email['data-testid']),
      { target: { value: 'test@example.com' } }
    );
    fireEvent.change(
      screen.getByTestId(SIGN_IN_FORM_DATA.password['data-testid']),
      { target: { value: 'password123!' } }
    );
    fireEvent.click(
      screen.getByTestId(SIGN_IN_FORM_DATA.submit['data-testid'])
    );

    await waitFor(() => {
      expect(signInWithEmailPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123!'
      );
    });
  });

  it('navigates to /welcome when user exists', async () => {
    (useAuthState as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      { uid: '123' },
      false,
      null,
    ]);

    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/welcome');
    });
  });

  it('renders links correctly', () => {
    expect(screen.getByText('Forgot password?').getAttribute('href')).toBe(
      '/reset'
    );
    expect(screen.getByText('Sign Up').getAttribute('href')).toBe('/sign-up');
  });
});
