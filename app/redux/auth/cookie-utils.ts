import Cookies from 'js-cookie';
import type { AuthUser } from './auth-slice';
import type { UserFirestoreProfile } from '~/lib/firebase/firebase-types';

const AUTH_COOKIE = 'authUser';
const PROFILE_COOKIE = 'userProfile';
const COOKIE_EXPIRE_DAYS = 7;

export const saveUserToCookie = (user: AuthUser) =>
  Cookies.set(AUTH_COOKIE, JSON.stringify(user), {
    expires: COOKIE_EXPIRE_DAYS,
  });

export const getUserFromCookie = (): AuthUser | null => {
  const cookie = Cookies.get(AUTH_COOKIE);
  return cookie ? JSON.parse(cookie) : null;
};

export const removeUserCookie = () => Cookies.remove(AUTH_COOKIE);

export const saveProfileToCookie = (
  uid: string,
  profile: UserFirestoreProfile
) =>
  Cookies.set(PROFILE_COOKIE, JSON.stringify({ uid, ...profile }), {
    expires: COOKIE_EXPIRE_DAYS,
  });

export const getProfileFromCookie = ():
  | (UserFirestoreProfile & { uid: string })
  | null => {
  const cookie = Cookies.get(PROFILE_COOKIE);
  return cookie ? JSON.parse(cookie) : null;
};

export const removeProfileCookie = () => Cookies.remove(PROFILE_COOKIE);
