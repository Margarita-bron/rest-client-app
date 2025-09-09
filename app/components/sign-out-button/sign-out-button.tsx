import { logout } from '~/utils/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/routes-path';

export const SignOutButton = () => {
  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
    navigate(ROUTES.home);
  };

  return (
    <button
      onClick={(e) => handleLogout(e)}
      className=" bg-indigo-500 rounded-lg px-4 py-2 text-sm font-medium text-gray-100 hover:bg-indigo-400 transition-colors cursor-pointer"
    >
      Sign out
    </button>
  );
};
