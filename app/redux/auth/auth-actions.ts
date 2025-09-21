import type { AppDispatch, RootState } from '~/redux/store';
import {
  setUser,
  setFirestoreProfile,
  setLoading,
  setError,
  type AuthUser,
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
import {
  saveUserToCookie,
  removeUserCookie,
  getUserFromCookie,
  saveProfileToCookie,
  getProfileFromCookie,
} from './cookie-utils';

type GetErrorFn = (code?: string) => FirebaseAuthErrorData;

const mapFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
});

export const firebaseAuthActions = {
  loginUser:
    (email: string, password: string, getError: GetErrorFn) =>
    async (dispatch: AppDispatch): Promise<boolean> => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        await signInWithEmailPasswordFn(email, password);
        const currentUser = auth.currentUser;
        if (!currentUser) return false;

        const mappedUser = mapFirebaseUser(currentUser);
        dispatch(setUser(mappedUser));
        saveUserToCookie(mappedUser);
        return true;
      } catch (error: unknown) {
        const errData = getError((error as { code?: string })?.code);
        dispatch(setError(errData.message));
        throw errData;
      } finally {
        dispatch(setLoading(false));
      }
    },

  registerUser:
    (name: string, email: string, password: string, getError: GetErrorFn) =>
    async (dispatch: AppDispatch): Promise<boolean> => {
      dispatch(setLoading(true));
      dispatch(setError(null));
      try {
        await registerWithEmailAndPasswordFn(name, email, password);
        const currentUser = auth.currentUser;
        if (!currentUser) return false;

        const mappedUser = mapFirebaseUser(currentUser);
        dispatch(setUser(mappedUser));
        saveUserToCookie(mappedUser);
        return true;
      } catch (error: unknown) {
        const errData = getError((error as { code?: string })?.code);
        dispatch(setError(errData.message));
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },

  resetPasswordUser:
    (email: string, getError: GetErrorFn) =>
    async (dispatch: AppDispatch): Promise<void> => {
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
    dispatch(setLoading(true));
    try {
      await logoutFn();
      dispatch(setUser(null));
      removeUserCookie();
    } finally {
      dispatch(setLoading(false));
    }
  },

  subscribeToAuthChanges:
    () =>
    (dispatch: AppDispatch): (() => void) => {
      const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
          const mappedUser = mapFirebaseUser(user);
          dispatch(setUser(mappedUser));
          saveUserToCookie(mappedUser);
        } else {
          dispatch(setUser(null));
          removeUserCookie();
        }
      });
      return unsubscribe;
    },

  loadUserFromCookie: () => (dispatch: AppDispatch) => {
    const userFromCookie = getUserFromCookie();
    if (userFromCookie) dispatch(setUser(userFromCookie));
  },

  fetchUserProfile:
    (uid: string, getError?: GetErrorFn) =>
    async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const currentUser = auth.currentUser;

      const reduxProfile = getState().auth.firestoreProfile as
        | (UserFirestoreProfile & { uid: string })
        | null;
      if (reduxProfile && currentUser && reduxProfile.uid === currentUser.uid) {
        dispatch(setLoading(false));
        return;
      }

      const cachedProfile = getProfileFromCookie();
      if (cachedProfile && cachedProfile.uid === uid) {
        dispatch(setFirestoreProfile(cachedProfile));
        dispatch(setLoading(false));
        return;
      }

      if (currentUser) {
        const mappedUser: AuthUser = mapFirebaseUser(currentUser);
        dispatch(setUser(mappedUser));
        saveUserToCookie(mappedUser);
      }

      try {
        const docSnap = await getDoc(doc(db, 'users', uid));
        const data = docSnap.exists()
          ? (docSnap.data() as UserFirestoreProfile)
          : null;

        if (data) {
          const profileWithUid = { uid, ...data };
          dispatch(setFirestoreProfile(profileWithUid));
          saveProfileToCookie(uid, data);
        }
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
