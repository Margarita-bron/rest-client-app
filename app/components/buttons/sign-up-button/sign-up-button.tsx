import { Link } from '~/lib/routing/navigation';
import { SIGN_UP_BUTTON_DATA } from './sign-up-button-data';
import { ROUTES } from '~/lib/routing/routes-path';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

export const SignUpButton = () => {
  const t = useTr('header');
  return (
    <Link
      data-testid={SIGN_UP_BUTTON_DATA['data-testid']}
      to={ROUTES.signUp}
      className="rounded-lg leading-relaxed bg-indigo-500 py-2 text-sm font-medium text-gray-100 hover:bg-indigo-400 transition-colors text-center w-30"
    >
      {t('signUp')}
    </Link>
  );
};
