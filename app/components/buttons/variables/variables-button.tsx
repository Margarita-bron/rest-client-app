import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';

const VariablesButton = () => {
  return (
    <Link
      to={ROUTES.variables}
      className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
    >
      Variables
    </Link>
  );
};

export default VariablesButton;
