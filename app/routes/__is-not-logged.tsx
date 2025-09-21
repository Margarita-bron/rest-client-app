import { Outlet, Navigate } from 'react-router';
import { useAuth } from '~/redux/auth/hooks';
import { ROUTES } from '~/lib/routing/routes-path';
import { useRouter } from '~/lib/routing/navigation';
import { useEffect, useState } from 'react';

export default function IsNotLogged() {
  const { isAuthenticated } = useAuth();
  const { locale } = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  if (!checked) return null;

  if (isAuthenticated) {
    const to = `/${locale}/${ROUTES.main}`;
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
