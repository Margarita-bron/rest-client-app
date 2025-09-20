import { useCallback } from 'react';
import {
  Link as RouterLink,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router';
import { routing, type Locale } from '~/lib/routing/routes-path';

function buildPath(locale: Locale, path: string, relative = false) {
  if (relative) return path;
  const trimmed = path.replace(/^\/+/, '');
  return trimmed === '' ? `/${locale}` : `/${locale}/${trimmed}`;
}

type LinkProps = {
  locale?: Locale;
  to: string;
  children: React.ReactNode;
  relative?: boolean;
} & Omit<React.ComponentProps<typeof RouterLink>, 'to'>;

export function Link({
  relative,
  to: toProp,
  locale,
  children,
  ...rest
}: LinkProps) {
  const { lang } = useParams();
  const navigateFn = useNavigate();
  const loc = locale ?? (lang as Locale) ?? routing.defaultLocale;
  const to = buildPath(loc, toProp, relative);
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (relative) return;
      e.preventDefault();
      navigateFn(to);
    },
    [navigateFn, to, relative]
  );

  if (relative) {
    return (
      <RouterLink {...rest} to={to}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a {...rest} href={to} onClick={handleClick}>
      {children}
    </a>
  );
}

export function useRouter() {
  const { lang } = useParams();
  const navigateFn = useNavigate();
  const location = useLocation();
  const locale = (lang as Locale) ?? routing.defaultLocale;

  const navigate = useCallback(
    (path: string, loc: Locale = locale) => navigateFn(buildPath(loc, path)),
    [navigateFn, locale]
  );

  const replace = useCallback(
    (path: string, loc: Locale = locale) =>
      navigateFn(buildPath(loc, path), { replace: true }),
    [navigateFn, locale]
  );

  return {
    locale,
    pathname: location.pathname,
    navigate,
    replace,
  };
}
