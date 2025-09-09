import { Link } from 'react-router';
import { ROUTES } from '~/routes-path';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '~/utils/firebase/firebase';

const Welcome = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="flex flex-col h-full scale-135 text-center">
      <h1 className="text-xl font-bold mb-5">
        Welcome Back{user ? `, ${user?.displayName}` : ''}!
      </h1>
      <div className="flex items-center gap-3 justify-center">
        <Link
          to={ROUTES.restClient}
          className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
        >
          REST Client
        </Link>
        <div className="w-px h-4 bg-gray-300" />
        <Link
          to={ROUTES.history}
          className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
        >
          History
        </Link>
        <div className="w-px h-4 bg-gray-300" />
        <Link
          to={ROUTES.variables}
          className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
        >
          Variables
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
