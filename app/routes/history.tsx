import { Link, useNavigate } from 'react-router';
import { ROUTES } from '~/routes-path';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '~/utils/firebase/firebase';
import { useEffect } from 'react';
import { emptyHistory, historyTitle } from '~/constants/history-page';

const History = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, loading, error, navigate]);

  const saveRequestHistory = () => {
    try {
      await addDoc(collection(db, 'requestHistory'), {
        ...entry,
        createdAt: serverTimestamp(),
      });
    } catch (error) {}
  };

  return (
    <div className="flex flex-col h-full scale-135 text-center">
      <div className="flex items-center gap-3 justify-center">
        <h2>{historyTitle}</h2>
        <Link
          to={ROUTES.restClient}
          className="border border-gray-300 hover:bg-gray-800 rounded-full p-2"
        >
          REST Client
        </Link>
      </div>
    </div>
  );
};
export default History;
