import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

export interface FirebaseAuthErrorData {
  message: string;
  action: string;
}

export const useFirebaseAuthErrorMessages = () => {
  const t = useTr('firebaseAuthErrors');

  const getError = (code?: string): FirebaseAuthErrorData => {
    const key = code || 'unknownError';
    const err = t(key, { returnObjects: true }) as
      | FirebaseAuthErrorData
      | undefined;

    if (!err) {
      return { message: 'Unknown error', action: '' };
    }

    return err;
  };

  return { getError };
};
