import { toast } from 'react-toastify';
import { useFirebaseAuthErrorMessages } from './firebase-errors';

interface ErrorWithCode {
  code: string;
  message?: string;
  action?: string;
}

interface ErrorWithMessage {
  message: string;
}

export const useShowAuthNotifications = () => {
  const { getError } = useFirebaseAuthErrorMessages();

  const showAuthErrorNotification = (error: unknown) => {
    let message = 'Unknown error';
    let action = '';

    if (error && typeof error === 'object') {
      if (
        'code' in error &&
        typeof (error as ErrorWithCode).code === 'string'
      ) {
        const errData = getError((error as ErrorWithCode).code);
        message = errData.message;
        action = errData.action;
      } else if (
        'message' in error &&
        typeof (error as ErrorWithMessage).message === 'string'
      ) {
        message = (error as ErrorWithMessage).message;
      }
    } else if (typeof error === 'string') {
      message = error;
    }

    toast.error(`${message}${action ? ' ' + action : ''}`);
  };

  const showAuthInfoNotification = (message: string) => {
    toast.info(message);
  };

  return { showAuthErrorNotification, showAuthInfoNotification };
};
