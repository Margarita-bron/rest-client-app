import { renderWithProviders } from '~/utils/testing/test-render';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { SignUpForm } from '../sign-up-form';
import { useAuth, useRegisterUser } from '~/redux/auth/hooks';
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
  useRegisterUser: vi.fn(),
}));

describe('SignUpForm navigation and routing', () => {
  const navigateMock = vi.fn();
  const registerMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue({
      locale: 'en',
      pathname: '/',
      navigate: navigateMock,
      replace: vi.fn(),
    });
    vi.mocked(useRegisterUser).mockReturnValue({ register: vi.fn() });
  });

  it('redirects to main page if user is already logged in', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: '123', email: 'existing@mail.com', name: 'Another Cool' },
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: true,
    });

    renderWithProviders(<SignUpForm />);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.main);
    });
  });

  it('navigates to main page after successful registration', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });
    vi.mocked(useRegisterUser).mockReturnValue({ register: registerMock });
    registerMock.mockResolvedValue(true);

    renderWithProviders(<SignUpForm />);

    fireEvent.input(screen.getByTestId('sign-up-name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.input(screen.getByTestId('sign-up-email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.input(screen.getByTestId('sign-up-password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByTestId('sign-up-submit'));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });
      expect(navigateMock).toHaveBeenCalledWith(ROUTES.main);
    });
  });
});
