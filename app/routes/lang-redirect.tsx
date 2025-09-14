import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { routing } from '~/lib/routing/routes-path';

export default function LangRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/${routing.defaultLocale}`, { replace: true });
  }, [navigate]);

  return null;
}
