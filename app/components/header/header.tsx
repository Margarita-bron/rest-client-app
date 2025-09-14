import { useAuthState } from 'react-firebase-hooks/auth';
import { HeaderAuth } from '~/components/header/header-auth';
import { HeaderGuest } from '~/components/header/header-guest';
import { auth } from '~/utils/firebase/firebase';

export const Header = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) return null;

  return user ? <HeaderAuth /> : <HeaderGuest />;
};
