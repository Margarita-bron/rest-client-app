import { useEffect } from 'react';
import WelcomeSkeleton from '../loading/welcome-skeleton';
import { useAuth } from '~/redux/auth/hooks';
import { firebaseAuthActions } from '~/redux/auth/auth-actions';

import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/redux/store';
import RestClientButton from '~/components/buttons/rest-client/rest-client-button';
import HistoryButton from '~/components/buttons/history/history-button';
import VariablesButton from '~/components/buttons/variables/variables-button';

const Welcome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, firestoreProfile, loading, error } = useAuth();
  const t = useTr('welcomePage');

  useEffect(() => {
    const unsubscribe = dispatch(firebaseAuthActions.subscribeToAuthChanges());
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) return <WelcomeSkeleton />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {t('loadingError')}
      </div>
    );

  const nameToDisplay = firestoreProfile?.name || user?.name;

  return (
    <div className="flex flex-col h-full scale-135 text-center">
      <h1 className="text-xl font-bold mb-5">
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
