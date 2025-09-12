import { Link, useNavigate } from 'react-router';
import { ROUTES } from '~/routes-path';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '~/utils/firebase/firebase';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import type { UserFirestoreProfile } from '~/types/firebase-types';
import WelcomeSkeleton from '../loading/welcome-skeleton';

const Welcome = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [firestoreProfile, setFirestoreProfile] =
    useState<UserFirestoreProfile | null>(null);
  const [firestoreLoading, setFirestoreLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;
    if (!user) {
      navigate('/');
    }
    if (user) {
      setFirestoreLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      unsubscribe = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setFirestoreProfile(docSnap.data() as UserFirestoreProfile);
          } else {
            setFirestoreProfile(null);
          }
          setFirestoreLoading(false);
        },
        (firestoreError) => {
          console.error(firestoreError);
          setFirestoreProfile(null);
          setFirestoreLoading(false);
        }
      );
    } else {
      setFirestoreProfile(null);
      setFirestoreLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  if (loading || firestoreLoading) {
    return <WelcomeSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p>{error.message}</p>
      </div>
    );
  }

  const nameToDisplay = firestoreProfile?.name || user?.displayName;

  return (
    <div className="flex flex-col h-full scale-135 text-center">
      <h1 className="text-xl font-bold mb-5">Welcome Back, {nameToDisplay}!</h1>
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
