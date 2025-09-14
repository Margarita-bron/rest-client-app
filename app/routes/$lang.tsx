import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '~/lib/i18n';

export default function LangLayout() {
  const { lang } = useParams();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return (
    <I18nextProvider i18n={i18n}>
      <Outlet />
    </I18nextProvider>
  );
}
