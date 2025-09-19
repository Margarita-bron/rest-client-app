import {
  auth,
  signInWithEmailPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout as firebaseLogout,
} from '~/lib/firebase/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  setUser,
  setFirestoreProfile,
  setLoading,
  setError,
} from './auth-slice';
import type { AppDispatch } from '~/redux/store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '~/lib/firebase/firebase';
import type { UserFirestoreProfile } from '~/lib/firebase/firebase-types';

const mapFirebaseUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
});

// --- login ---
export const loginUser =
  (email: string, password: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setUser(null));
    try {
      await signInWithEmailPassword(email, password);
      const currentUser = auth.currentUser;
      if (currentUser) dispatch(setUser(mapFirebaseUser(currentUser)));
    } catch (error: unknown) {
      dispatch(
        setError(error instanceof Error ? error.message : 'Unknown error')
      );
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

// --- register ---
export const registerUser =
  (name: string, email: string, password: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await registerWithEmailAndPassword(name, email, password);
      const currentUser = auth.currentUser;
      if (currentUser) dispatch(setUser(mapFirebaseUser(currentUser)));
    } catch (error: unknown) {
      dispatch(
        setError(error instanceof Error ? error.message : 'Unknown error')
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

// --- reset password ---
export const resetPasswordUser =
  (email: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      await sendPasswordReset(email);
    } catch (error: unknown) {
      dispatch(
        setError(error instanceof Error ? error.message : 'Unknown error')
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

// --- logout ---
export const logoutUser =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    await firebaseLogout();
    dispatch(setUser(null));
  };

// --- subscribe ---
export const subscribeToAuthChanges =
  () =>
  (dispatch: AppDispatch): (() => void) => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) dispatch(setUser(mapFirebaseUser(user)));
      else dispatch(setUser(null));
    });
    return unsubscribe;
  };

// --- fetch firestore profile ---
export const fetchUserProfile =
  (uid: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        dispatch(setFirestoreProfile(docSnap.data() as UserFirestoreProfile));
      } else dispatch(setFirestoreProfile(null));
    } catch (error: unknown) {
      dispatch(
        setError(error instanceof Error ? error.message : 'Unknown error')
      );
      dispatch(setFirestoreProfile(null));
    } finally {
      dispatch(setLoading(false));
    }
  };
