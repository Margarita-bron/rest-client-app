import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '~/utils/firebase/firebase';
import { HeaderAuth } from './header-auth';
import { HeaderGuest } from './header-guest';

export const Header = () => {
  const [user, loading, error] = useAuthState(auth);

  return user ? <HeaderGuest /> : <HeaderAuth />;
};
