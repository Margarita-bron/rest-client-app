import { HeaderAuth } from '~/components/header/header-auth';
import { HeaderGuest } from '~/components/header/header-guest';
import { useAuth } from '~/redux/auth/hooks';
import { Loader } from '~/ui/loader';

export const Header = () => {
  const { user, loading } = useAuth();
  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      {loading ? <Loader /> : user ? <HeaderAuth /> : <HeaderGuest />}
    </header>
  );
};
