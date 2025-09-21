import { BUTTON_TEST_IDS } from '~/components/buttons/button-test-ids';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';

export const RestClientButton = () => {
  const t = useTr('mainPage');

  return (
    <Link
      to={'/rest-client'}
      className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
      data-testid={BUTTON_TEST_IDS.restClient}
    >
      {t('restClient')}
    </Link>
  );
};
