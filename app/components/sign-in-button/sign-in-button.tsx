import { Link } from 'react-router';
import { ROUTES } from '~/routes-path';

export const SignInButton = () => {
  return (
    <Link
      to={ROUTES.signIn}
      onClick={() => console.log('Sign In clicked')}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
    >
      Sign In
    </Link>
  );
};
