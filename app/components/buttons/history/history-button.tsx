import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { BUTTON_TEST_IDS } from '~/components/buttons/button-test-ids';

export const HistoryButton = () => {
  const t = useTr('mainPage');
  return (
    <Link
      to={ROUTES.history}
      data-testid={BUTTON_TEST_IDS.history}
      className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
    >
      {t('history')}
    </Link>
  );
};
