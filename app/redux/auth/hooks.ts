import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '~/redux/store';
import { firebaseAuthActions } from './auth-actions';
import { useFirebaseAuthErrorMessages } from '~/lib/firebase/firebase-errors';
import { useMemo, useCallback } from 'react';
import { useShowAuthNotifications } from '~/lib/firebase/firebase-notification';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Хук для получения состояния аутентификации
export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const firestoreProfile = useSelector(
    (state: RootState) => state.auth.firestoreProfile
  );
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  return useMemo(
    () => ({
      user,
      loading,
      error,
      firestoreProfile,
      isAuthenticated: !!user,
    }),
    [user, loading, error, firestoreProfile]
  );
};

// Login
type LoginParams = { email: string; password: string };
export const useLoginUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();
  const { showAuthErrorNotification, showAuthInfoNotification } =
    useShowAuthNotifications();

  const login = useCallback(
    async (data: LoginParams) => {
      try {
        const success = await dispatch(
          firebaseAuthActions.loginUser(data.email, data.password, getError)
        );
        if (success) showAuthInfoNotification('Login successful!');
        return { success: !!success, error: null };
      } catch (err: unknown) {
        showAuthErrorNotification(err);
        return { success: false, error: err };
      }
    },
    [dispatch, getError, showAuthErrorNotification, showAuthInfoNotification]
  );

  return { login };
};

// Register
type RegisterParams = { name: string; email: string; password: string };
export const useRegisterUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();
  const { showAuthErrorNotification, showAuthInfoNotification } =
    useShowAuthNotifications();

  const register = useCallback(
    async (data: RegisterParams) => {
      try {
        const success = await dispatch(
          firebaseAuthActions.registerUser(
            data.name,
            data.email,
            data.password,
            getError
          )
        );
        if (success) showAuthInfoNotification('Registration successful!');
        return success;
      } catch (err: unknown) {
        showAuthErrorNotification(err);
      }
    },
    [dispatch, getError, showAuthErrorNotification, showAuthInfoNotification]
  );

  return { register };
};

// Reset Password
export const useResetPasswordUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();
  const { showAuthErrorNotification, showAuthInfoNotification } =
    useShowAuthNotifications();

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        await dispatch(firebaseAuthActions.resetPasswordUser(email, getError));
        showAuthInfoNotification('Password reset email sent!');
      } catch (err: unknown) {
        showAuthErrorNotification(err);
      }
    },
    [dispatch, getError, showAuthErrorNotification, showAuthInfoNotification]
  );

  return { resetPassword };
};

// Logout
export const useLogoutUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showAuthErrorNotification, showAuthInfoNotification } =
    useShowAuthNotifications();

  const logout = useCallback(async () => {
    try {
      await dispatch(firebaseAuthActions.logoutUser());
      showAuthInfoNotification('Logout successful!');
    } catch (err: unknown) {
      showAuthErrorNotification(err);
    }
  }, [dispatch, showAuthErrorNotification, showAuthInfoNotification]);

  return { logout };
};

// Subscribe to Auth Changes
export const useSubscribeToAuthChanges = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showAuthErrorNotification } = useShowAuthNotifications();

  const subscribe = useCallback(() => {
    try {
      const unsubscribe = dispatch(
        firebaseAuthActions.subscribeToAuthChanges()
      );
      return unsubscribe;
    } catch (err: unknown) {
      showAuthErrorNotification(err);
    }
  }, [dispatch, showAuthErrorNotification]);

  return { subscribe };
};

// Fetch User Profile
export const useFetchUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();
  const { showAuthErrorNotification } = useShowAuthNotifications();

  const fetchProfile = useCallback(
    async (uid?: string) => {
      if (!uid) return;
      try {
        return await dispatch(
          firebaseAuthActions.fetchUserProfile(uid, getError)
        );
      } catch (err: unknown) {
        showAuthErrorNotification(err);
      }
    },
    [dispatch, getError, showAuthErrorNotification]
  );

  return { fetchProfile };
};
