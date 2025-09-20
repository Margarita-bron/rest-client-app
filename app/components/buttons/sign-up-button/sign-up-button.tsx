import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { BUTTON_TEST_IDS } from '~/components/buttons/button-test-ids';

export const SignUpButton = () => {
  const t = useTr('header');
  return (
    <Link
      data-testid={BUTTON_TEST_IDS.signUp}
      to={ROUTES.signUp}
      className="rounded-lg leading-relaxed bg-indigo-500 py-2 text-sm font-medium text-gray-100 hover:bg-indigo-400 transition-colors text-center w-30"
    >
      {t('signUp')}
    </Link>
  );
};
