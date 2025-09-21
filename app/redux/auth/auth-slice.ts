import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserFirestoreProfile } from '~/lib/firebase/firebase-types';
import { getUserFromCookie } from './cookie-utils';

export interface AuthUser {
  uid: string;
  email: string | null;
  name: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  firestoreProfile: UserFirestoreProfile | null;
  loading: boolean;
  error: string | null;
}

const initialUser = getUserFromCookie();

const initialState: AuthState = {
  user: initialUser ?? null,
  firestoreProfile: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload ?? null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFirestoreProfile(
      state,
      action: PayloadAction<UserFirestoreProfile | null>
    ) {
      state.firestoreProfile = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setUser, setFirestoreProfile, setLoading, setError } =
  authSlice.actions;

export default authSlice.reducer;
