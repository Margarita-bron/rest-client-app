import { Link } from 'react-router';
import { ROUTES } from '~/routes-path';

export const SignInButton = () => {
  return (
    <Link
      to={ROUTES.signIn}
      className="rounded-lg border border-gray-300 leading-relaxed px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-300 hover:text-gray-600 transition-colors"
    >
      Sign In
    </Link>
  );
};
