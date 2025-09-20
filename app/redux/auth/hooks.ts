import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '~/redux/store';
import { firebaseAuthActions } from './auth-actions';
import { useFirebaseAuthErrorMessages } from '~/lib/firebase/firebase-errors';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { useShowAuthNotifications } from '~/lib/firebase/firebase-notification';
import 'react-toastify/dist/ReactToastify.css';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { getUserFromCookie } from '~/redux/auth/cookie-utils';

export const useAuth = () => {
  const userFromState = useSelector((state: RootState) => state.auth.user);
  const firestoreProfile = useSelector(
    (state: RootState) => state.auth.firestoreProfile
  );
  const reduxLoading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const [initLoading, setInitLoading] = useState(true);

  const user = userFromState ?? getUserFromCookie();

  useEffect(() => {
    setInitLoading(false);
  }, []);

  const loading = reduxLoading || initLoading;

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

type LoginParams = { email: string; password: string };
export const useLoginUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();
  const { showAuthErrorNotification, showAuthInfoNotification } =
    useShowAuthNotifications();
  const t = useTr('authNotifications');

  const login = useCallback(
    async (data: LoginParams) => {
      try {
        const success = await dispatch(
          firebaseAuthActions.loginUser(data.email, data.password, getError)
        );
        if (success) showAuthInfoNotification(t('loginSuccess'));
        return { success: !!success, error: null };
      } catch (err: unknown) {
        showAuthErrorNotification(err);
        return { success: false, error: err };
      }
    },
    [dispatch, getError, showAuthErrorNotification, showAuthInfoNotification, t]
  );

  return { login };
};

type RegisterParams = { name: string; email: string; password: string };
export const useRegisterUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();
  const { showAuthErrorNotification, showAuthInfoNotification } =
    useShowAuthNotifications();
  const t = useTr('authNotifications');

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
        if (success) showAuthInfoNotification(t('registerSuccess'));
        return success;
      } catch (err: unknown) {
        showAuthErrorNotification(err);
      }
    },
    [dispatch, getError, showAuthErrorNotification, showAuthInfoNotification, t]
  );

  return { register };
};

export const useResetPasswordUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();
  const { showAuthErrorNotification, showAuthInfoNotification } =
    useShowAuthNotifications();
  const t = useTr('authNotifications');

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        await dispatch(firebaseAuthActions.resetPasswordUser(email, getError));
        showAuthInfoNotification(t('resetPasswordSuccess'));
      } catch (err: unknown) {
        showAuthErrorNotification(err);
      }
    },
    [dispatch, getError, showAuthErrorNotification, showAuthInfoNotification, t]
  );

  return { resetPassword };
};

export const useLogoutUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showAuthErrorNotification, showAuthInfoNotification } =
    useShowAuthNotifications();
  const t = useTr('authNotifications');

  const logout = useCallback(async () => {
    try {
      await dispatch(firebaseAuthActions.logoutUser());
      showAuthInfoNotification(t('logoutSuccess'));
    } catch (err: unknown) {
      showAuthErrorNotification(err);
    }
  }, [dispatch, showAuthErrorNotification, showAuthInfoNotification, t]);

  return { logout };
};

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
