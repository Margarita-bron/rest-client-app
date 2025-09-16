import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import WelcomeSkeleton from '../loading/welcome-skeleton';
import type { AppDispatch } from '~/redux/store';
import {
  fetchUserProfile,
  subscribeToAuthChanges,
} from '~/redux/auth/auth-actions';
import { useAuth } from '~/redux/auth/hooks';
import { useTranslation } from 'react-i18next';

const Welcome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, firestoreProfile, loading, error } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = dispatch(subscribeToAuthChanges());
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (!user?.uid) return;
    dispatch(fetchUserProfile(user.uid));
  }, [user?.uid, dispatch]);

  if (loading) return <WelcomeSkeleton />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );

  const nameToDisplay = firestoreProfile?.name || user?.name;

  return (
    <div className="flex flex-col h-full scale-135 text-center">
      <h1 className="text-xl font-bold mb-5">
        {' '}
        {t('welcome')}, {nameToDisplay}!
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
