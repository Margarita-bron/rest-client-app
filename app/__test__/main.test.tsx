import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, vi } from 'vitest';
import Main from '~/routes/main';
import { useAuth } from '~/redux/auth/hooks';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '~/redux/store';

vi.mock('~/redux/auth/hooks', () => ({
  useAuth: vi.fn(),
}));

vi.mock('~/lib/i18n/hooks/use-translate-custom', () => ({
  useTr: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));

vi.mock('~/components/loading/welcome-skeleton', () => ({
  default: () => <div data-testid="welcome-skeleton">Loading...</div>,
}));

vi.mock('~/components/buttons/rest-client/rest-client-button', () => ({
  RestClientButton: () => <button>RestClientButton</button>,
}));

vi.mock('~/components/buttons/history/history-button', () => ({
  HistoryButton: () => <button>HistoryButton</button>,
}));

vi.mock('~/components/buttons/variables/variables-button', () => ({
  VariablesButton: () => <button>VariablesButton</button>,
}));

vi.mock('~/redux/auth/auth-actions', () => ({
  firebaseAuthActions: {
    subscribeToAuthChanges: vi.fn().mockReturnValue(() => {}),
  },
}));

describe('Main component', () => {
  const useAuthMock = vi.mocked(useAuth);
  const useTrMock = vi.mocked(useTr);
  const useDispatchMock = vi.mocked(useDispatch);

  beforeEach(() => {
    vi.clearAllMocks();

    const dispatchMock: AppDispatch = vi.fn().mockReturnValue(() => {});
    useDispatchMock.mockReturnValue(dispatchMock);

    useTrMock.mockReturnValue(
      ((key: string) => key) as unknown as ReturnType<typeof useTr>
    );
  });

  it('renders error message when error occurs', () => {
    useAuthMock.mockReturnValue({
      user: null,
      firestoreProfile: null,
      loading: false,
      error: 'Some error',
      isAuthenticated: false,
    });

    render(<Main />);
    expect(screen.getByText('loadingError')).toBeInTheDocument();
  });

  it('renders welcome message with user name', () => {
    useAuthMock.mockReturnValue({
      user: { uid: '1', name: 'John Doe', email: 'john@example.com' },
      firestoreProfile: null,
      loading: false,
      error: null,
      isAuthenticated: true,
    });

    render(<Main />);
    expect(screen.getByText('welcome, John Doe!')).toBeInTheDocument();
    expect(screen.getByText('RestClientButton')).toBeInTheDocument();
    expect(screen.getByText('HistoryButton')).toBeInTheDocument();
    expect(screen.getByText('VariablesButton')).toBeInTheDocument();
  });

  it('uses firestoreProfile name if available', () => {
    useAuthMock.mockReturnValue({
      user: { uid: '1', name: 'John Doe', email: 'john@example.com' },
      firestoreProfile: {
        name: 'Jane Profile',
        email: 'jane@example.com',
        authProvider: 'local',
      },
      loading: false,
      error: null,
      isAuthenticated: true,
    });

    render(<Main />);
    expect(screen.getByText('welcome, Jane Profile!')).toBeInTheDocument();
  });
});
