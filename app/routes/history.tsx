import { Link, useNavigate } from 'react-router';
import { ROUTES } from '~/routes-path';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getUserRequestHistory } from '~/utils/firebase/firebase';
import { useEffect, useState } from 'react';
import { emptyHistory } from '~/constants/history-page';
import type { UserRequestHistory } from '~/types/request-analytic';

const History = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [requestsHistory, setRequestsHistory] = useState<UserRequestHistory>(
    []
  );
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const data = await getUserRequestHistory(user?.uid);
        setRequestsHistory(data);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  return (
    <div className="flex flex-col h-full scale-135 text-center">
      <div className="flex items-center gap-3 justify-center">
        {loading || loadingHistory}
        {requestsHistory.length === 0 && !loadingHistory && (
          <>
            {' '}
            <h2>{emptyHistory}</h2>
            <Link
              to={ROUTES.restClient}
              className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
            >
              REST Client
            </Link>
          </>
        )}
        <ul>
          {requestsHistory.map((item) => (
            <li> </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default History;
