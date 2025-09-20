import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { SignInForm } from '../sign-in-form';
import { useAuth, useLoginUser } from '~/redux/auth/hooks';
import { useRouter } from '~/lib/routing/navigation';
import { renderWithProviders } from '~/utils/testing/test-render';
import { ROUTES } from '~/lib/routing/routes-path';

vi.mock('~/lib/routing/navigation', () => ({
  useRouter: vi.fn(),
  Link: ({
    children,
    ...props
  }: React.PropsWithChildren<React.ComponentProps<'a'>>) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('~/redux/auth/hooks', () => ({
  useAuth: vi.fn(),
  useLoginUser: vi.fn(),
}));

describe('SignInForm', () => {
  const navigateMock = vi.fn();
  const loginMock = vi.fn();

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({
      locale: 'en',
      pathname: '/',
      navigate: navigateMock,
      replace: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });

    vi.mocked(useLoginUser).mockReturnValue({ login: loginMock });
    vi.clearAllMocks();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<SignInForm />);

    const emailInput = screen.getByTestId('sign-in-email');
    const passwordInput = screen.getByTestId('sign-in-password');
    const submitButton = screen.getByTestId('sign-in-submit');

    fireEvent.input(emailInput, { target: { value: 'a' } });
    fireEvent.input(emailInput, { target: { value: '' } });

    fireEvent.input(passwordInput, { target: { value: 'a' } });
    fireEvent.input(passwordInput, { target: { value: '' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Password must be at least 8 characters long/i)
      ).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<SignInForm />);

    const emailInput = screen.getByTestId('sign-in-email');
    const passwordInput = screen.getByTestId('sign-in-password');
    const submitButton = screen.getByTestId('sign-in-submit');

    fireEvent.input(emailInput, { target: { value: '2131232132' } });
    fireEvent.blur(emailInput);

    fireEvent.input(passwordInput, { target: { value: '12345678' } });
    fireEvent.blur(passwordInput);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  it('calls login and navigates on success', async () => {
    loginMock.mockResolvedValue({ success: true });

    renderWithProviders(<SignInForm />);
    fireEvent.input(screen.getByTestId('sign-in-email'), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.input(screen.getByTestId('sign-in-password'), {
      target: { value: 'Password123$' },
    });
    fireEvent.click(screen.getByTestId('sign-in-submit'));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'test@mail.com',
        password: 'Password123$',
      });
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.main);
    });
  });
  it('disables submit button and shows submitting text when loading', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });

    renderWithProviders(<SignInForm />);

    const submitButton = screen.getByTestId('sign-in-submit');

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Signing In/i);
  });

  it('renders error message when login fails', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: 'Network error',
      firestoreProfile: null,
      isAuthenticated: false,
    });

    renderWithProviders(<SignInForm />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
