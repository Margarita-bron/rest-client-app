import { logout } from '~/utils/firebase/firebase';
import { useNavigate } from 'react-router-dom';

export const SingOutButton = () => {
  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <button
      onClick={(e) => handleLogout(e)}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
    >
      Sing out
    </button>
  );
};
