import { BUTTON_TEST_IDS } from '~/components/buttons/button-test-ids';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';

export const SignInButton = () => {
  const t = useTr('header');
  return (
    <Link
      to={ROUTES.signIn}
      data-testid={BUTTON_TEST_IDS.signIn}
      className="rounded-lg border border-gray-300 leading-relaxed py-2 text-sm font-medium text-gray-300 hover:bg-gray-300 hover:text-gray-600 text-center transition-colors w-30"
    >
      {t('signIn')}
    </Link>
  );
};
