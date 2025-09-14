import { HeaderAuth } from '~/components/header/header-auth';
import { HeaderGuest } from '~/components/header/header-guest';
import { useAuth } from '~/redux/auth/hooks';

export const Header = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <HeaderAuth /> : <HeaderGuest />;
};
