import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';

const RestClientButton = () => {
  return (
    <Link
      to={ROUTES.restClient}
      className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
    >
      REST Client
    </Link>
  );
};

export default RestClientButton;
