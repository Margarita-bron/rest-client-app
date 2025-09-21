import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, vi } from 'vitest';
import { useAuth } from '~/redux/auth/hooks';
import { useRouter } from '~/lib/routing/navigation';
import { useNavigate } from 'react-router';
import type { Locale } from '~/lib/routing/routes-path';
import PrivateLayout from '~/routes/__private';

vi.mock('~/redux/auth/hooks', () => ({
  useAuth: vi.fn(),
}));

vi.mock('~/lib/routing/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('PrivateLayout', () => {
  const useAuthMock = vi.mocked(useAuth);
  const useRouterMock = vi.mocked(useRouter);
  const useNavigateMock = vi.mocked(useNavigate);

  it('should render nothing while checked false', () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
    });
    useRouterMock.mockReturnValue({
      locale: 'en',
      pathname: '',
      navigate: function (path: string, loc?: Locale): void {
        throw new Error('Function not implemented.');
      },
      replace: function (path: string, loc?: Locale): void {
        throw new Error('Function not implemented.');
      },
    });
    useNavigateMock.mockReturnValue(vi.fn());

    const { container } = render(
      <MemoryRouter>
        <PrivateLayout />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render to home while not auth', () => {
    const navigateMock = vi.fn();
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
    });
    useRouterMock.mockReturnValue({
      locale: 'en',
      pathname: '',
      navigate: function (path: string, loc?: Locale): void {
        throw new Error('Function not implemented.');
      },
      replace: function (path: string, loc?: Locale): void {
        throw new Error('Function not implemented.');
      },
    });
    useNavigateMock.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <PrivateLayout />
      </MemoryRouter>
    );

    expect(navigateMock).toHaveBeenCalledWith('/en/', { replace: true });
  });

  it('should render Outlet after auth', async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
    });
    useRouterMock.mockReturnValue({
      locale: 'en',
      pathname: '',
      navigate: function (path: string, loc?: Locale): void {
        throw new Error('Function not implemented.');
      },
      replace: function (path: string, loc?: Locale): void {
        throw new Error('Function not implemented.');
      },
    });
    useNavigateMock.mockReturnValue(vi.fn());

    render(
      <MemoryRouter initialEntries={['/some']}>
        <Routes>
          <Route path="*" element={<PrivateLayout />}>
            <Route path="*" element={<div>rfvgere</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('rfvgere')).toBeInTheDocument();
    });
  });
});
