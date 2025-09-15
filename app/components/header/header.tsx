import { HeaderAuth } from '~/components/header/header-auth';
import { HeaderGuest } from '~/components/header/header-guest';
import { HeaderSkeleton } from '~/components/header/header-skeleton';
import { useAuth } from '~/redux/auth/hooks';

export const Header = () => {
  const { user, loading } = useAuth();
  return (
    <header className="bg-gray-950 sticky top-0 z-50">
      {loading ? <HeaderSkeleton /> : user ? <HeaderAuth /> : <HeaderGuest />}
    </header>
  );
};
