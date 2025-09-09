import { Link } from 'react-router';
import { ROUTES } from '~/routes-path';

export const SignUpButton = () => {
  return (
    <div>
      <Link
        to={ROUTES.signUp}
        onClick={() => console.log('Sign Up clicked')}
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
};
