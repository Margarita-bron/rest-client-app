import { screen, waitFor } from '@testing-library/react';
import { Header } from '~/components/header/header';
import { renderWithProviders } from '~/utils/testing/test-render';
import * as authHooks from '~/redux/auth/hooks';
import { HEADER_TEST_IDS } from '~/components/header/header-test-ids';

vi.mock('~/redux/auth/hooks', () => ({
  useAuth: vi.fn(),
  useLogoutUser: () => ({ logout: vi.fn() }),
}));

describe('Header', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const baseAuthState = {
    user: null,
    loading: false,
    error: null,
    firestoreProfile: null,
    isAuthenticated: false,
  };

  it('renders HeaderSkeleton when loading=true', () => {
    vi.mocked(authHooks.useAuth).mockReturnValue({
      ...baseAuthState,
      loading: true,
    });

    renderWithProviders(<Header />);

    expect(screen.getByText(/REST Client App/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders HeaderGuest when user=null', () => {
    vi.mocked(authHooks.useAuth).mockReturnValue({
      ...baseAuthState,
      user: null,
    });

    renderWithProviders(<Header />);

    expect(screen.getByText(/REST Client App/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders HeaderAuth when user exists', () => {
    vi.mocked(authHooks.useAuth).mockReturnValue({
      ...baseAuthState,
      user: { uid: '123', email: 'some@mail.com', name: 'Cool Name' },
      isAuthenticated: true,
    });

    renderWithProviders(<Header />);

    expect(screen.getByText(/REST Client App/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /main page/i })
    ).toBeInTheDocument();
  });

  it('changes height on scroll', async () => {
    vi.mocked(authHooks.useAuth).mockReturnValue(baseAuthState);

    renderWithProviders(<Header />);

    const header = screen.getByTestId(HEADER_TEST_IDS.header);
    expect(header).toHaveClass('h-20');

    Object.defineProperty(window, 'scrollY', { value: 20, writable: true });
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(header).toHaveClass('h-16');
    });
  });
});
