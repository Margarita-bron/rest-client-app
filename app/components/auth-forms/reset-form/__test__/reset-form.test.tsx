import { screen, fireEvent, act } from '@testing-library/react';
import { ResetForm } from '../reset-form';
import { renderWithProviders } from '~/utils/testing/test-render';
import * as authHooks from '~/redux/auth/hooks';
import * as routerHooks from '~/lib/routing/navigation';
import { vi } from 'vitest';
import type { AuthUser } from '~/redux/auth/auth-slice';

describe('ResetForm', () => {
  const resetPasswordMock = vi.fn();
  const navigateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(authHooks, 'useResetPasswordUser').mockReturnValue({
      resetPassword: resetPasswordMock,
    });

    vi.spyOn(authHooks, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });

    vi.spyOn(routerHooks, 'useRouter').mockReturnValue({
      locale: 'en',
      pathname: '/reset',
      navigate: navigateMock,
      replace: vi.fn(),
    });
  });

  it('renders all form elements', () => {
    renderWithProviders(<ResetForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /reset password/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('shows an error when email is empty after user interaction', async () => {
    renderWithProviders(<ResetForm />);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.blur(emailInput);

    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));

    expect(
      await screen.findByText(/enter a valid email address/i)
    ).toBeInTheDocument();
  });

  it('calls resetPassword with the correct email', async () => {
    renderWithProviders(<ResetForm />);
    const emailInput = screen.getByLabelText(/email/i);

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });

    expect(resetPasswordMock).toHaveBeenCalledWith('test@example.com');
  });

  it('calls navigate if a user exists and there is no error', () => {
    vi.spyOn(authHooks, 'useAuth').mockReturnValue({
      user: { uid: '1', email: 'a@b.com', name: 'Test' } as AuthUser,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: true,
    });

    renderWithProviders(<ResetForm />);
    expect(navigateMock).toHaveBeenCalled();
  });

  it('displays a global error message', () => {
    vi.spyOn(authHooks, 'useAuth').mockReturnValue({
      user: null,
      loading: false,
      error: 'Some error',
      firestoreProfile: null,
      isAuthenticated: false,
    });

    renderWithProviders(<ResetForm />);
    expect(screen.getByText('Some error')).toBeInTheDocument();
  });
});
