import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { SignUpForm } from '../sign-up-form';
import { SIGN_UP_FORM } from '../sign-up-form.data';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router';

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(),
}));

vi.mock('~/lib/firebase/firebase', () => ({
  auth: {},
  registerWithEmailAndPassword: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('SignUpForm', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useAuthState as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      null,
      false,
      null,
    ]);
    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate
    );

    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );
  });

  it('renders all inputs and submit button', () => {
    expect(
      screen.getByTestId(SIGN_UP_FORM.name['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SIGN_UP_FORM.email['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SIGN_UP_FORM.password['data-testid'])
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(SIGN_UP_FORM.submit['data-testid'])
    ).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    const nameInput = screen.getByTestId(SIGN_UP_FORM.name['data-testid']);
    const emailInput = screen.getByTestId(SIGN_UP_FORM.email['data-testid']);
    const passwordInput = screen.getByTestId(
      SIGN_UP_FORM.password['data-testid']
    );

    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);
    fireEvent.focus(passwordInput);
    fireEvent.blur(passwordInput);

    fireEvent.click(screen.getByTestId(SIGN_UP_FORM.submit['data-testid']));

    expect(
      await screen.findByText(/Name must be at least 2 characters/i)
    ).toBeTruthy();
    expect(
      await screen.findByText(/Enter a valid email address/i)
    ).toBeTruthy();
    expect(
      await screen.findByText(/Password must be at least 8 characters long/i)
    ).toBeTruthy();
  });

  it('calls registerWithEmailAndPassword with correct data', async () => {
    const { registerWithEmailAndPassword } = await import(
      '~/lib/firebase/firebase'
    );

    fireEvent.change(screen.getByTestId(SIGN_UP_FORM.name['data-testid']), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByTestId(SIGN_UP_FORM.email['data-testid']), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId(SIGN_UP_FORM.password['data-testid']), {
      target: { value: 'Abc123$%' },
    });

    fireEvent.click(screen.getByTestId(SIGN_UP_FORM.submit['data-testid']));

    await waitFor(() => {
      expect(registerWithEmailAndPassword).toHaveBeenCalledWith(
        'John Doe',
        'test@example.com',
        'Abc123$%'
      );
    });
  });

  it('shows password validation messages for invalid passwords', async () => {
    const passwordInput = screen.getByTestId(
      SIGN_UP_FORM.password['data-testid']
    );

    const cases = [
      { value: 'Ab1$', message: 'at least 8 characters' },
      { value: '12345678$', message: 'one letter' },
      { value: 'Abcdefg$', message: 'one number' },
      { value: 'Abc12345', message: 'one special character' },
    ];

    for (const { value, message } of cases) {
      fireEvent.change(passwordInput, { target: { value } });
      fireEvent.click(screen.getByTestId(SIGN_UP_FORM.submit['data-testid']));
      expect(await screen.findByText((t) => t.includes(message))).toBeTruthy();
    }
  });

  it('navigates to /welcome if user exists', async () => {
    (useAuthState as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      { uid: '123' },
      false,
      null,
    ]);

    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/welcome');
    });
  });

  it('renders sign-in link', () => {
    const link = screen.getByText('Sign In');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/sign-in');
  });
});
