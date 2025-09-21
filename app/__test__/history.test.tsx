import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import * as firebase from '~/lib/firebase/firebase';
import * as reactRouter from 'react-router';
import * as useAuthHook from 'react-firebase-hooks/auth';
import * as routerHook from '~/lib/routing/navigation';
import * as i18nHook from '~/lib/i18n/hooks/use-translate-custom';
import History from '~/routes/history';

vi.mock('react-router', async () => {
  const actual: any = await vi.importActual('react-router');
  return { ...actual, useNavigate: vi.fn() };
});

vi.mock('~/lib/routing/navigation', () => ({
  useRouter: vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

vi.mock('~/lib/routing/rest-client-path', () => ({
  buildShareRoute: vi.fn((m, u) => `/share/${m}`),
}));

vi.mock('~/ui/loader', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock('~/components/buttons/rest-client/rest-client-button', () => ({
  RestClientButton: () => <button>RestClientButton</button>,
}));

describe('History component', () => {
  const mockUser = { uid: 'user1' };
  const mockNavigate = vi.fn();
  const mockT = vi.fn((key: string) => key);

  beforeEach(() => {
    vi.restoreAllMocks();

    vi.spyOn(useAuthHook, 'useAuthState').mockReturnValue([
      mockUser,
      false,
    ] as any);
    vi.spyOn(firebase, 'getUserRequestHistory').mockResolvedValue([]);

    vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);

    vi.spyOn(routerHook, 'useRouter').mockReturnValue({
      locale: 'en',
      pathname: '/',
      navigate: mockNavigate,
      replace: mockNavigate,
    });

    vi.spyOn(i18nHook, 'useTr').mockReturnValue(((key: string) => key) as any);
  });

  it('renders loader when auth is loading', () => {
    vi.spyOn(useAuthHook, 'useAuthState').mockReturnValue([null, true] as any);

    render(<History />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders empty message when no history', async () => {
    vi.spyOn(firebase, 'getUserRequestHistory').mockResolvedValue([]);

    render(<History />);

    expect(await screen.findByText('emptyMessage')).toBeInTheDocument();
    expect(screen.getByText('emptyHint')).toBeInTheDocument();
    expect(screen.getByText('RestClientButton')).toBeInTheDocument();
  });

  it('renders history items', async () => {
    const historyData = [
      {
        id: '1',
        method: 'get',
        url: '/test',
        body: '',
        duration: 123,
        requestSize: 10,
        responseSize: 20,
        statusCode: 200,
        headers: { 'x-test': '1' },
        errorMessage: '',
        createdAt: 1000,
      },
      {
        id: '2',
        method: 'post',
        url: '/post',
        body: '',
        duration: 456,
        requestSize: 5,
        responseSize: 15,
        statusCode: 404,
        headers: {},
        errorMessage: 'Not found',
        createdAt: 2000,
      },
    ];

    vi.spyOn(firebase, 'getUserRequestHistory').mockResolvedValue(historyData);

    render(<History />);

    expect(await screen.findByText('/test')).toBeInTheDocument();
    expect(screen.getByText('/post')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });
});
