import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';

export const RestClientButton = () => {
  const t = useTr('mainPage');
  return (
    <Link
      to={ROUTES.restClient}
      className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
    >
      {t('restClient')}
    </Link>
  );
};