import { toast } from 'react-toastify';
import { useFirebaseAuthErrorMessages } from '~/lib/firebase/firebase-errors';

export const useShowAuthErrorNotification = () => {
  const { getError } = useFirebaseAuthErrorMessages();

  const showAuthErrorNotification = (error: unknown) => {
    if (error && typeof error === 'object' && 'code' in error) {
      const code = (error as { code: string }).code;
      const errData = getError(code);
      toast.error(`${errData.message} ${errData.action}`);
      return;
    }
    toast.error(getError('unknownError').message);
  };

  const showAuthInfoNotification = (message: string) => {
    toast.info(message);
  };

  return { showAuthErrorNotification, showAuthInfoNotification };
};
