import { useNavigate } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import type { UserRequestHistory } from '~/types/history-analytic';
import { auth, getUserRequestHistory } from '~/lib/firebase/firebase';
import RestClientButton from '~/components/buttons/rest-client/rest-client-button';
import { Link, useRouter } from '~/lib/routing/navigation';
import { buildShareRoute } from '~/lib/routing/rest-client-path';

const History = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const { locale } = useRouter();
  const [requestsHistory, setRequestsHistory] = useState<UserRequestHistory>(
    []
  );
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
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
      <div className="flex items-center gap-3 justify-center flex-col">
        {(loading || loadingHistory) && (
          <div className="text-center py-10 text-gray-500">Загрузка...</div>
        )}
        {requestsHistory.length === 0 && !loadingHistory && (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-lg mb-2">
              You haven't executed any requests It's empty here.
            </p>
            <p className="text-sm text-gray-400 mb-4">Try:</p>
            <RestClientButton />
          </div>
        )}
        {requestsHistory.length > 0 && (
          <ul className="space-y-4">
            {requestsHistory.map((item) => {
              const headers = Object.entries(item.headers || {}).map(
                ([key, value]) => ({
                  id: key,
                  key,
                  value: String(value),
                  enabled: true,
                })
              );

              const shareRoute = buildShareRoute(
                item.method ?? 'GET',
                item.url ?? '',
                item.body || '',
                headers
              );

              return (
                <li key={item.createdAt} className="bg-gray-800 p-4 rounded-lg">
                  <Link to={shareRoute}>
                    [{item.method?.toUpperCase()}] {item.url}
                  </Link>
                  {
                    <div className="text-sm text-gray-400 mt-2">
                      <p>⏱ Duration: {item.duration} мс</p>
                      <p>📦 Request size: {item.requestSize ?? '—'} bite</p>
                      <p>📥 Response size: {item.responseSize ?? '—'} bite</p>

                      <p>✅ Status: {item.statusCode}</p>
                      {item.errorMessage && (
                        <p className="text-red-400">
                          ⚠️ Error: {item.errorMessage}
                        </p>
                      )}
                    </div>
                  }
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
export default History;
