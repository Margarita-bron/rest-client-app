import { useNavigate } from 'react-router';
import { ROUTES, routing } from '~/lib/routing/routes-path';

import { useAuth } from '~/redux/auth/hooks';

const NotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (user) {
      navigate(`/${ROUTES.main}`, { replace: true });
    } else {
      navigate(`/${ROUTES.home}`, { replace: true });
    }
  };

  return (
    <main className="grid h-[100vh] place-items-center bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-400">404</p>
        <h1 className="mt-4 text-sm font-semibold tracking-tight text-balance text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={handleGoHome}
            className="rounded-md cursor-pointer bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Go back home
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
