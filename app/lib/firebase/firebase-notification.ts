import { toast } from 'react-toastify';
import { useFirebaseAuthErrorMessages } from './firebase-errors';

export const useShowAuthNotifications = () => {
  const { getError } = useFirebaseAuthErrorMessages();

  const showAuthErrorNotification = (error: unknown) => {
    let message = 'Unknown error';
    let action = '';

    if (error && typeof error === 'object') {
      if ('code' in error && typeof (error as any).code === 'string') {
        const errData = getError((error as any).code);
        message = errData.message;
        action = errData.action;
      } else if (
        'message' in error &&
        typeof (error as any).message === 'string'
      ) {
        message = (error as any).message;
      }
    } else if (typeof error === 'string') {
      message = error;
    }
    console.log('ERROR');

    toast.error(`${message}${action ? ' ' + action : ''}`);
  };

  const showAuthInfoNotification = (message: string) => {
    console.log('SUCCESS');
    toast.info(message);
  };

  return { showAuthErrorNotification, showAuthInfoNotification };
};
