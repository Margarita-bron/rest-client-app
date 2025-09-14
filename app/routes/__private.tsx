import { useAuthState } from 'react-firebase-hooks/auth';
import { Outlet, redirect } from 'react-router';
import { ROUTES } from '~/lib/routing/routes-path';
import { auth } from '~/utils/firebase/firebase';

// export async function PrivateWrapper() {
//   const [user, loading, error] = useAuthState(auth);
//   if (!user) {
//     return null;
//   }
// }

export default function PrivateLayout() {
  return <Outlet />;
}
