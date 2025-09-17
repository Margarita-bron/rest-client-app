import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WelcomeSkeleton from '../loading/welcome-skeleton';
import type { AppDispatch } from '~/redux/store';
import {
  fetchUserProfile,
  subscribeToAuthChanges,
} from '~/redux/auth/auth-actions';
import { useAuth } from '~/redux/auth/hooks';
import { useTranslation } from 'react-i18next';
import RestClientButton from '~/components/buttons/rest-client/rest-client-button';
import VariablesButton from '~/components/buttons/variables/variables-button';
import HistoryButton from '~/components/buttons/history/history-button';

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
        <RestClientButton />
        <div className="w-px h-4 bg-gray-300" />
        <HistoryButton />
        <div className="w-px h-4 bg-gray-300" />
        <VariablesButton />
      </div>
    </div>
  );
};

export default Welcome;
