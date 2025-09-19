import { Outlet, useParams } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '~/lib/i18n';
import { routing } from '~/lib/routing/routes-path';
import NotFound from '~/routes/not-found';

export default function LangLayout() {
  const { lang } = useParams();
  const locales = routing.locales as readonly string[];

  if (!lang || !locales.includes(lang)) {
    return <NotFound />;
  }

  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Outlet />
    </I18nextProvider>
  );
}
