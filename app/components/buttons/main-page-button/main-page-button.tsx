import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';

export const MainPageButton = () => {
  const t = useTr('header');
  return (
    <Link
      to={ROUTES.signIn}
      className="rounded-lg border border-gray-300 leading-relaxed py-2 text-sm font-medium text-gray-300 hover:bg-gray-300 hover:text-gray-600 transition-colors w-30 text-center"
    >
      {t('mainPage')}
    </Link>
  );
};
