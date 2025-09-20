import { renderWithProviders } from '~/utils/testing/test-render';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { SignInForm } from '../sign-in-form';
import { useAuth, useLoginUser } from '~/redux/auth/hooks';
import { useRouter } from '~/lib/routing/navigation';
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

describe('SignInForm navigation and routing', () => {
  const navigateMock = vi.fn();
  const loginMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      locale: 'en',
      pathname: '/',
      navigate: navigateMock,
      replace: vi.fn(),
    });
    vi.mocked(useLoginUser).mockReturnValue({ login: vi.fn() });
  });

  it('redirects to main page if user is already logged in', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: '123', email: 'existing@mail.com', name: 'User' },
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: true,
    });

    renderWithProviders(<SignInForm />);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.main);
    });
  });

  it('navigates to main page after successful login', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });
    vi.mocked(useLoginUser).mockReturnValue({ login: loginMock });
    loginMock.mockResolvedValue({ success: true });

    renderWithProviders(<SignInForm />);

    fireEvent.input(screen.getByTestId('sign-in-email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.input(screen.getByTestId('sign-in-password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByTestId('sign-in-submit'));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'Password123!',
      });
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.main);
    });
  });
});
