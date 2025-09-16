import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/redux/store';
import { logoutUser } from '~/redux/auth/auth-actions';
import { useRouter } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';

export const SignOutButton = () => {
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
      className="bg-indigo-500 rounded-lg px-4 py-2 text-sm font-medium text-gray-100 hover:bg-indigo-400 transition-colors cursor-pointer"
    >
      Sign out
    </button>
  );
};
