import { Link } from 'react-router';
import { SIGN_UP_BUTTON_DATA } from '~/components/sign-up-button/sign-up-button-data';
import { ROUTES } from '~/routes-path';

export const SignUpButton = () => {
  return (
    <div>
      <Link
        data-testid={SIGN_UP_BUTTON_DATA['data-testid']}
        to={ROUTES.signUp}
        onClick={() => console.log('Sign Up clicked')}
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
};
