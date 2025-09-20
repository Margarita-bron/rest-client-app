import { useNavigate } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import type { UserRequestHistory } from '~/types/history-analytic';
import { auth, getUserRequestHistory } from '~/lib/firebase/firebase';
import { RestClientButton } from '~/components/buttons/rest-client/rest-client-button';
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
      if (!user) return;
      setLoadingHistory(true);
      try {
        const data = await getUserRequestHistory(user.uid);
        setRequestsHistory(data);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  if (loading || loadingHistory) {
    return <div className="text-center py-10 text-gray-500">Загрузка...</div>;
  }

  if (requestsHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-lg mb-2">
            You haven't executed any requests. It's empty here.
          </p>
          <p className="text-sm text-gray-400 mb-4">Try:</p>
          <RestClientButton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <div className="min-w-[1000px]">
        <div className="grid grid-cols-[100px_400px_100px_100px_100px_80px_200px] gap-2 bg-gray-800 text-white p-3 rounded-t-lg font-semibold sticky top-0 z-10">
          <div>Method</div>
          <div>URL</div>
          <div>Duration (ms)</div>
          <div>Req Size (B)</div>
          <div>Res Size (B)</div>
          <div>Status</div>
          <div>Error</div>
        </div>
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
            <div
              key={item.createdAt}
              className="grid grid-cols-[100px_400px_100px_100px_100px_80px_200px] gap-2 bg-gray-900 text-white p-3 border-b border-gray-700 hover:bg-gray-800"
            >
              <div className="font-mono">{item.method?.toUpperCase()}</div>
              <div className="truncate overflow-x-auto">
                <Link to={shareRoute} className="underline hover:text-blue-400">
                  {item.url}
                </Link>
              </div>
              <div>{item.duration}</div>
              <div>{item.requestSize ?? '—'}</div>
              <div>{item.responseSize ?? '—'}</div>
              <div>{item.statusCode}</div>
              <div className="text-red-400 truncate">
                {item.errorMessage ?? '-'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
