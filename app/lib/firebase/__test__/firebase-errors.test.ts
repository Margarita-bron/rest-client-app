import { describe, it, vi, expect, beforeEach } from 'vitest';
import { useFirebaseAuthErrorMessages } from '../firebase-errors';
import * as useTrModule from '~/lib/i18n/hooks/use-translate-custom';

describe('useFirebaseAuthErrorMessages', () => {
  const tMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useTrModule, 'useTr').mockReturnValue(tMock);
  });

  it('returns the error for a known code', () => {
    tMock.mockReturnValue({ message: 'Invalid login', action: 'Retry' });

    const { getError } = useFirebaseAuthErrorMessages();
    const result = getError('auth/invalid-credential');

    expect(tMock).toHaveBeenCalledWith('auth/invalid-credential', {
      returnObjects: true,
    });
    expect(result).toEqual({ message: 'Invalid login', action: 'Retry' });
  });

  it('returns unknown error if code is unknown', () => {
    tMock.mockReturnValue(undefined);

    const { getError } = useFirebaseAuthErrorMessages();
    const result = getError('auth/unknown-code');

    expect(result).toEqual({ message: 'Unknown error', action: '' });
  });

  it('returns unknown error if no code is provided', () => {
    tMock.mockReturnValue(undefined);

    const { getError } = useFirebaseAuthErrorMessages();
    const result = getError();

    expect(tMock).toHaveBeenCalledWith('unknownError', { returnObjects: true });
    expect(result).toEqual({ message: 'Unknown error', action: '' });
  });
});
