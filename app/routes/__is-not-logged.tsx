import { Outlet, Navigate } from 'react-router';
import { useAuth } from '~/redux/auth/hooks';
import { ROUTES } from '~/lib/routing/routes-path';
import { useRouter } from '~/lib/routing/navigation';

export default function IsNotLogged() {
  const { isAuthenticated } = useAuth();
  const { locale } = useRouter();
  console.log('Is not logged');

  if (isAuthenticated) {
    const to = `/${locale}/${ROUTES.welcome}`;
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
