import { toast } from 'react-toastify';
import { FirebaseAuthErrorMessages } from '~/constants/firebase-errors';

const showAuthErrorNotification = (error: unknown) => {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    const errData = FirebaseAuthErrorMessages[code];
    if (errData) {
      toast.error(`${errData.message} ${errData.action}`);
      return;
    }
  }
  toast.error('An unknown error occurred. Please try again.');
};

const showAuthInfoNotification = (message: string) => {
  toast.info(message);
};

export { showAuthErrorNotification, showAuthInfoNotification };
