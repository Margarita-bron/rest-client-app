import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { SignUpForm } from '../sign-up-form';
import { useAuth, useRegisterUser } from '~/redux/auth/hooks';
import { useRouter } from '~/lib/routing/navigation';
import { renderWithProviders } from '~/utils/testing/test-render';
import { ROUTES } from '~/lib/routing/routes-path';

vi.mock('~/lib/routing/navigation', () => ({
  useRouter: vi.fn(),
  Link: ({
    children,
    ...props
  }: React.ComponentProps<'a'> & { children: React.ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('~/redux/auth/hooks', () => ({
  useAuth: vi.fn(),
  useRegisterUser: vi.fn(),
}));

describe('SignUpForm', () => {
  const navigateMock = vi.fn();
  const registerMock = vi.fn();

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

    vi.mocked(useRegisterUser).mockReturnValue({ register: registerMock });
    vi.clearAllMocks();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<SignUpForm />);

    const nameInput = screen.getByTestId('sign-up-name');
    const emailInput = screen.getByTestId('sign-up-email');
    const passwordInput = screen.getByTestId('sign-up-password');
    const submitButton = screen.getByTestId('sign-up-submit');

    // Триггерим пустые поля через ввод и стирание
    fireEvent.input(nameInput, { target: { value: 'a' } });
    fireEvent.input(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);

    fireEvent.input(emailInput, { target: { value: 'a' } });
    fireEvent.input(emailInput, { target: { value: '' } });
    fireEvent.blur(emailInput);

    fireEvent.input(passwordInput, { target: { value: 'a' } });
    fireEvent.input(passwordInput, { target: { value: '' } });
    fireEvent.blur(passwordInput);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Name must be at least 2 characters/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Enter a valid email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Password must be at least 8 characters long/i)
      ).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<SignUpForm />);

    const emailInput = screen.getByTestId('sign-up-email');
    const passwordInput = screen.getByTestId('sign-up-password');
    const submitButton = screen.getByTestId('sign-up-submit');

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

  it('calls register and navigates on success', async () => {
    registerMock.mockResolvedValue(true);

    renderWithProviders(<SignUpForm />);
    fireEvent.input(screen.getByTestId('sign-up-name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.input(screen.getByTestId('sign-up-email'), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.input(screen.getByTestId('sign-up-password'), {
      target: { value: 'Password123$' },
    });
    fireEvent.click(screen.getByTestId('sign-up-submit'));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'test@mail.com',
        password: 'Password123$',
      });
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.main);
    });
  });
  it('disables submit button and shows signing up text when loading', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });

    renderWithProviders(<SignUpForm />);

    const submitButton = screen.getByTestId('sign-up-submit');

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Signing up/i);
  });

  it('renders error message when registration fails', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: 'Network error',
      firestoreProfile: null,
      isAuthenticated: false,
    });

    renderWithProviders(<SignUpForm />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });
});
