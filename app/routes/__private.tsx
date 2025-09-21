import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '~/redux/auth/hooks';
import { ROUTES } from '~/lib/routing/routes-path';
import { useRouter } from '~/lib/routing/navigation';
import { useEffect, useState } from 'react';

export default function PrivateLayout() {
  const { isAuthenticated } = useAuth();
  const { locale } = useRouter();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${locale}/${ROUTES.home}`, { replace: true });
    }
    setChecked(true);
  }, [isAuthenticated, locale, navigate]);
  if (!checked || !isAuthenticated) return null;

  return <Outlet />;
}
