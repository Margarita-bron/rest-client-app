import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/redux/store';
import { logoutUser } from '~/redux/auth/auth-actions';
import { useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

export const SignOutButton = () => {
  const t = useTr('header');
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useRouter();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await dispatch(logoutUser());
      navigate(ROUTES.signIn);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-indigo-500 rounded-lg px-4 py-2 text-sm font-medium text-gray-100 hover:bg-indigo-400 transition-colors cursor-pointer w-25 text-center"
    >
      {t('signOut')}
    </button>
  );
};
