import { describe, it, vi, beforeEach, expect } from 'vitest';
import { toast } from 'react-toastify';
import { useShowAuthNotifications } from '../firebase-notification';
import * as useFirebaseModule from '../firebase-errors';

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), info: vi.fn() },
}));

describe('useShowAuthNotifications', () => {
  const getErrorMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useFirebaseModule, 'useFirebaseAuthErrorMessages').mockReturnValue(
      {
        getError: getErrorMock,
      }
    );
  });

  it('shows error notification with code', () => {
    getErrorMock.mockReturnValue({ message: 'Invalid login', action: 'Retry' });
    const { showAuthErrorNotification } = useShowAuthNotifications();

    showAuthErrorNotification({ code: 'auth/invalid-credential' });

    expect(getErrorMock).toHaveBeenCalledWith('auth/invalid-credential');
    expect(toast.error).toHaveBeenCalledWith('Invalid login Retry');
  });

  it('shows error notification with message property', () => {
    getErrorMock.mockReturnValue({ message: 'should not be used', action: '' });
    const { showAuthErrorNotification } = useShowAuthNotifications();

    showAuthErrorNotification({ message: 'Custom error message' });

    expect(toast.error).toHaveBeenCalledWith('Custom error message');
    expect(getErrorMock).not.toHaveBeenCalled();
  });

  it('shows error notification when passed a string', () => {
    const { showAuthErrorNotification } = useShowAuthNotifications();

    showAuthErrorNotification('String error');

    expect(toast.error).toHaveBeenCalledWith('String error');
  });

  it('shows error notification for unknown error', () => {
    getErrorMock.mockReturnValue({ message: 'Unknown error', action: '' });
    const { showAuthErrorNotification } = useShowAuthNotifications();

    showAuthErrorNotification(undefined);

    expect(toast.error).toHaveBeenCalledWith('Unknown error');
  });

  it('shows info notification', () => {
    const { showAuthInfoNotification } = useShowAuthNotifications();

    showAuthInfoNotification('Info message');

    expect(toast.info).toHaveBeenCalledWith('Info message');
  });
});
