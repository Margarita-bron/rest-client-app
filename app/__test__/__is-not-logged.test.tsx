import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, it, vi, beforeEach } from 'vitest';
import { useRouter } from '~/lib/routing/navigation';
import { useAuth } from '~/redux/auth/hooks';
import IsNotLogged from '~/routes/__is-not-logged';

vi.mock('../redux/auth/hooks', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../lib/routing/navigation', () => ({
  useRouter: vi.fn(),
}));

const useAuthMock = vi.mocked(useAuth);
const useRouterMock = vi.mocked(useRouter);

describe('IsNotLogged', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should not rendered while checked false', () => {
    useAuthMock.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });
    useRouterMock.mockReturnValue({
      locale: 'en',
      pathname: '/',
      navigate: () => {},
      replace: () => {},
    });

    const { container } = render(
      <MemoryRouter>
        <IsNotLogged />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('should navigate after isAuthenticated=true', async () => {
    useAuthMock.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: true,
    });
    useRouterMock.mockReturnValue({
      locale: 'en',
      pathname: '/',
      navigate: () => {},
      replace: () => {},
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="*" element={<IsNotLogged />} />
          <Route path="/en/main" element={<div>Главная страница</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Главная страница')).toBeInTheDocument();
    });
  });

  it('should render child Outlet if not auth', async () => {
    useAuthMock.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });
    useRouterMock.mockReturnValue({
      locale: 'en',
      pathname: '/',
      navigate: () => {},
      replace: () => {},
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<IsNotLogged />}>
            <Route path="*" element={<div>fbfd</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('fbfd')).toBeInTheDocument();
    });
  });
});
