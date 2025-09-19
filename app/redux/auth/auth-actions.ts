import type { AppDispatch, RootState } from '~/redux/store';
import {
  setUser,
  setFirestoreProfile,
  setLoading,
  setError,
} from './auth-slice';
import { auth, db } from '~/lib/firebase/firebase';
import type { UserFirestoreProfile } from '~/lib/firebase/firebase-types';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  signInWithEmailPasswordFn,
  registerWithEmailAndPasswordFn,
  sendPasswordResetFn,
  logoutFn,
} from '~/lib/firebase/firebase';
import type { FirebaseAuthErrorData } from '~/lib/firebase/firebase-errors';

type GetErrorFn = (code?: string) => FirebaseAuthErrorData;

const mapFirebaseUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
});

export const firebaseAuthActions = {
  loginUser:
    (email: string, password: string, getError: GetErrorFn) =>
    async (dispatch: AppDispatch): Promise<boolean> => {
      console.log('loginUser called');
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        await signInWithEmailPasswordFn(email, password);
        const currentUser = auth.currentUser;
        if (!currentUser) return false;

        dispatch(setUser(mapFirebaseUser(currentUser)));
        return true;
      } catch (error: unknown) {
        const errData = getError((error as { code?: string })?.code);
        dispatch(setError(errData.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },
  registerUser:
    (name: string, email: string, password: string, getError: GetErrorFn) =>
    async (dispatch: AppDispatch): Promise<boolean> => {
      console.log('registerUser called');
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        await registerWithEmailAndPasswordFn(name, email, password);
        const currentUser = auth.currentUser;
        if (!currentUser) return false;
        dispatch(setUser(mapFirebaseUser(currentUser)));
        return true;
      } catch (error: unknown) {
        const errData = getError((error as { code?: string })?.code);
        dispatch(setError(errData.message));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },

  resetPasswordUser:
    (email: string, getError: GetErrorFn) =>
    async (dispatch: AppDispatch): Promise<void> => {
      console.log('resetPasswordUser called');
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        await sendPasswordResetFn(email);
      } catch (error: unknown) {
        const errData = getError((error as { code?: string })?.code);
        dispatch(setError(errData.message));
      } finally {
        dispatch(setLoading(false));
      }
    },

  logoutUser: () => async (dispatch: AppDispatch) => {
    console.log('logoutUser called');
    dispatch(setLoading(true));
    try {
      await logoutFn();
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  },

  subscribeToAuthChanges:
    () =>
    (dispatch: AppDispatch): (() => void) => {
      console.log('subscribeToAuthChanges called');
      const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
        if (user) dispatch(setUser(mapFirebaseUser(user)));
        else dispatch(setUser(null));
      });
      return unsubscribe; // важно вернуть unsubscribe
    },

  fetchUserProfile:
    (uid: string, getError?: GetErrorFn) =>
    async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
      console.log('fetchUserProfile called');
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        const docSnap = await getDoc(doc(db, 'users', uid));
        const data = docSnap.exists()
          ? (docSnap.data() as UserFirestoreProfile)
          : null;

        const prev = getState().auth.firestoreProfile;
        const hasChanged =
          (!prev && data) ||
          (!data && prev) ||
          (prev &&
            data &&
            (prev.name !== data.name || prev.email !== data.email));

        if (hasChanged) dispatch(setFirestoreProfile(data));
      } catch (error: unknown) {
        const msg = getError
          ? getError((error as { code?: string })?.code).message
          : error instanceof Error
            ? error.message
            : 'Unknown error';
        dispatch(setError(msg));
        dispatch(setFirestoreProfile(null));
      } finally {
        dispatch(setLoading(false));
      }
    },
};
