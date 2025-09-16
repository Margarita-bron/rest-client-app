import { useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '~/lib/i18n';
import { ROUTES, routing } from '~/lib/routing/routes-path';

export default function LangLayout() {
  const { lang } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const locales = routing.locales as readonly string[];
    if (!lang || !locales.includes(lang)) {
      navigate(ROUTES.home, { replace: true });
      return;
    }
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, navigate]);

  return (
    <I18nextProvider i18n={i18n}>
      <Outlet />
    </I18nextProvider>
  );
}
