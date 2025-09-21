import { useNavigate } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import type { UserRequestHistory } from '~/types/history-analytic';
import { auth, getUserRequestHistory } from '~/lib/firebase/firebase';
import { RestClientButton } from '~/components/buttons/rest-client/rest-client-button';
import { Link, useRouter } from '~/lib/routing/navigation';
import { buildShareRoute } from '~/lib/routing/rest-client-path';
import { Loader } from '~/ui/loader';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

const History = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const { locale } = useRouter();
  const [requestsHistory, setRequestsHistory] = useState<UserRequestHistory>(
    []
  );
  const [loadingHistory, setLoadingHistory] = useState(false);
  const t = useTr('history');

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
    return <Loader />;
  }

  if (requestsHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-lg mb-2">{t('emptyMessage')}</p>
          <p className="text-sm text-gray-400 mb-4">{t('emptyHint')}</p>
          <RestClientButton />
        </div>
      </div>
    );
  }

  const sortedHistory = [...requestsHistory].sort(
    (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
  );

  return (
    <div className="w-full overflow-auto my-10">
      <div className="min-w-[1000px]">
        {/* header */}
        <div className="grid grid-cols-[100px_400px_120px_120px_120px_100px_200px] gap-2 bg-gray-950 border-2 border-gray-600 border-b-0 text-white px-4 py-3 rounded-t-lg font-semibold sticky top-0 z-10 text-center">
          <div>{t('method')}</div>
          <div>{t('url')}</div>
          <div>{t('duration')}</div>
          <div>{t('requestSize')}</div>
          <div>{t('responseSize')}</div>
          <div>{t('status')}</div>
          <div>{t('error')}</div>
        </div>

        {sortedHistory.map((item, index) => {
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
              key={item.id ?? item.createdAt}
              className={`grid grid-cols-[100px_400px_120px_120px_120px_100px_200px] gap-2 px-4 py-3 border-b border-gray-700 ${
                index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
              } hover:bg-gray-700`}
            >
              <div className="font-mono text-center">
                {item.method?.toUpperCase()}
              </div>
              <div className="truncate overflow-x-auto text-center">
                <Link to={shareRoute} className="underline hover:text-blue-400">
                  {item.url}
                </Link>
              </div>
              <div className="text-center">{item.duration}</div>
              <div className="text-center">{item.requestSize ?? '—'}</div>
              <div className="text-center">{item.responseSize ?? '—'}</div>
              <div className="text-center">{item.statusCode}</div>
              <div className="text-red-400 overflow-x-auto whitespace-nowrap text-center">
                {item.errorMessage && item.errorMessage.trim() !== ''
                  ? item.errorMessage
                  : '-'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
