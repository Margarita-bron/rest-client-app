import { useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { useLogoutUser } from '~/redux/auth/hooks';
import { BUTTON_TEST_IDS } from '~/components/buttons/button-test-ids';

export const SignOutButton = () => {
  const t = useTr('header');
  const { navigate } = useRouter();
  const { logout } = useLogoutUser();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await logout();
    navigate(ROUTES.signIn);
  };

  return (
    <button
      onClick={handleLogout}
      data-testid={BUTTON_TEST_IDS.signOut}
      className="rounded-lg leading-relaxed cursor-pointer bg-indigo-500 py-2 text-sm font-medium text-gray-100 hover:bg-indigo-400 transition-colors text-center w-30"
    >
      {t('signOut')}
    </button>
  );
};
