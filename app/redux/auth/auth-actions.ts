import {
  auth,
  signInWithEmailPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout as firebaseLogout,
} from '~/lib/firebase/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { setUser, setLoading, setError } from './auth-slice';
import { localStorageUser } from '~/redux/auth/local-storage-user';
import type { AppDispatch } from '~/redux/store';

export const loginUser =
  (email: string, password: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      await signInWithEmailPassword(email, password);
      const currentUser = auth.currentUser;
      if (currentUser) {
        dispatch(setUser(currentUser));
        localStorageUser.set(currentUser);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const registerUser =
  (name: string, email: string, password: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      await registerWithEmailAndPassword(name, email, password);
      const currentUser = auth.currentUser;
      if (currentUser) {
        dispatch(setUser(currentUser));
        localStorageUser.set(currentUser);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const resetPasswordUser =
  (email: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      await sendPasswordReset(email);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const logoutUser =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    await firebaseLogout();
    dispatch(setUser(null));
    localStorageUser.remove();
  };

export const subscribeToAuthChanges =
  () =>
  (dispatch: AppDispatch): (() => void) => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      dispatch(setUser(user));
      localStorageUser.set(user);
    });
    return unsubscribe;
  };
