import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '~/redux/store';
import { firebaseAuthActions } from './auth-actions';
import { useFirebaseAuthErrorMessages } from '~/lib/firebase/firebase-errors';
import { useMemo, useCallback } from 'react';

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

  const login = useCallback(
    async (data: LoginParams) =>
      dispatch(
        firebaseAuthActions.loginUser(data.email, data.password, getError)
      ),
    [dispatch, getError]
  );

  return { login };
};

// Register
type RegisterParams = { name: string; email: string; password: string };
export const useRegisterUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();

  const register = useCallback(
    async (data: RegisterParams) =>
      dispatch(
        firebaseAuthActions.registerUser(
          data.name,
          data.email,
          data.password,
          getError
        )
      ),
    [dispatch, getError]
  );

  return { register };
};

// Reset Password
export const useResetPasswordUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();

  const resetPassword = useCallback(
    async (email: string) =>
      dispatch(firebaseAuthActions.resetPasswordUser(email, getError)),
    [dispatch, getError]
  );

  return { resetPassword };
};

// Logout
export const useLogoutUser = () => {
  const dispatch = useDispatch<AppDispatch>();

  const logout = useCallback(
    async () => dispatch(firebaseAuthActions.logoutUser()),
    [dispatch]
  );

  return { logout };
};

// Subscribe to Auth Changes
export const useSubscribeToAuthChanges = () => {
  const dispatch = useDispatch<AppDispatch>();

  const subscribe = useCallback(() => {
    const unsubscribe = dispatch(firebaseAuthActions.subscribeToAuthChanges());
    return unsubscribe;
  }, [dispatch]);

  return { subscribe };
};

// Fetch User Profile безопасно
export const useFetchUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getError } = useFirebaseAuthErrorMessages();

  const fetchProfile = useCallback(
    async (uid?: string) => {
      if (!uid) return;
      return dispatch(firebaseAuthActions.fetchUserProfile(uid, getError));
    },
    [dispatch, getError]
  );

  return { fetchProfile };
};
