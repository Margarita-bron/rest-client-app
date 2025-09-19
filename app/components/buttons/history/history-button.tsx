import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

export const HistoryButton = () => {
  const t = useTr('mainPage');
  return (
    <Link
      to={ROUTES.history}
      className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
    >
      {t('history')}
    </Link>
  );
};
