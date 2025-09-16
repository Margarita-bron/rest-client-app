import { Outlet, Navigate } from 'react-router';
import { useAuth } from '~/redux/auth/hooks';
import { ROUTES } from '~/lib/routing/routes-path';
import { useRouter } from '~/lib/routing/navigation';

export default function PrivateLayout() {
  const { isAuthenticated } = useAuth();
  const { locale } = useRouter();

  if (!isAuthenticated) {
    const to = `/${locale}/${ROUTES.home}`;
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
