import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignOutButton } from '../sign-out-button/sign-out-button';
import { BUTTON_TEST_IDS } from '~/components/buttons/button-test-ids';
import { ROUTES } from '~/lib/routing/routes-path';

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: () => (key: string) => key,
}));

const mockNavigate = vi.fn();
vi.mock('~/lib/routing/navigation', () => ({
  useRouter: () => ({ navigate: mockNavigate }),
}));

const mockLogout = vi.fn();
vi.mock('~/redux/auth/hooks', () => ({
  useLogoutUser: () => ({ logout: mockLogout }),
}));

describe('SignOutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders button with text and test id', () => {
    render(<SignOutButton />);
    const button = screen.getByTestId(BUTTON_TEST_IDS.signOut);

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('signOut');
  });

  it('calls logout and navigates to signIn when clicked', async () => {
    mockLogout.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<SignOutButton />);
    const button = screen.getByTestId(BUTTON_TEST_IDS.signOut);

    await user.click(button);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.signIn);
  });
});
