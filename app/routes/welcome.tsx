import { Header } from '~/components/header/header';
import { Footer } from '~/components/footer/footer';
import { Link } from 'react-router';
import { ROUTES } from '~/routes-path';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '~/utils/firebase/firebase';

const Welcome = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="min-h-screen flex flex-col ">
      <Header />
      <main className="flex-1 container mx-auto flex justify-center items-center text-center">
        <div className="flex flex-col  h-full scale-135">
          <h1 className="text-xl font-bold mb-5">
            Welcome Back{user ? `, ${user?.displayName}` : ''}!
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.restClient}
              className="border border-gray-300 hover:bg-gray-100 rounded-full p-2"
            >
              REST Client
            </Link>
            <div className="w-px h-4 bg-gray-300" />
            <Link
              to={ROUTES.history}
              className="border border-gray-300 hover:bg-gray-100 rounded-full p-2"
            >
              History
            </Link>
            <div className="w-px h-4 bg-gray-300" />
            <Link
              to={ROUTES.variables}
              className="border border-gray-300 hover:bg-gray-100 rounded-full p-2"
            >
              Variables
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Welcome;
