import { Link } from '~/lib/routing/navigation';
import { SIGN_UP_BUTTON_DATA } from '~/components/sign-up-button/sign-up-button-data';
import { ROUTES } from '~/lib/routing/routes-path';

export const SignUpButton = () => {
  return (
    <Link
      data-testid={SIGN_UP_BUTTON_DATA['data-testid']}
      to={ROUTES.signUp}
      className="rounded-lg leading-relaxed bg-indigo-500 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-indigo-400 transition-colors"
    >
      Sign Up
    </Link>
  );
};
