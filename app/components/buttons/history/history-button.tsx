import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';

const HistoryButton = () => {
  return (
    <Link
      to={ROUTES.history}
      className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
    >
      History
    </Link>
  );
};

export default HistoryButton;
