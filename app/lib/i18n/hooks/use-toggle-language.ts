import { useNavigate, useLocation, useParams } from 'react-router';
import { Locale, routing } from '~/lib/routing/routes-path';

export function useToggleLanguage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang: Locale }>();

  const locale: Locale = (lang as Locale) ?? routing.defaultLocale;

  const toggleLanguage = () => {
    const newLocale: Locale = locale === Locale.en ? Locale.ru : Locale.en;
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length && routing.locales.includes(segments[0] as Locale)) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    const newPath = '/' + segments.join('/') + location.search + location.hash;

    navigate(newPath, { replace: true });
  };

  return {
    locale,
    toggleLanguage,
  };
}
