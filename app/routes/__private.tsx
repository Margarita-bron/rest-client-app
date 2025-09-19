import { Outlet, Navigate } from 'react-router';
import { useAuth } from '~/redux/auth/hooks';
import { ROUTES } from '~/lib/routing/routes-path';
import { useRouter } from '~/lib/routing/navigation';

export default function PrivateLayout() {
  const { isAuthenticated, loading } = useAuth();
  const { locale } = useRouter();
  const to = `/${locale}/${ROUTES.home}`;
  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to={to} replace />;
  }
  return <Outlet />;
}
