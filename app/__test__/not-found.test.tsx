import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import NotFound from '~/routes/not-found';
import { useAuth } from '~/redux/auth/hooks';
import { useNavigate } from 'react-router';
import { ROUTES } from '~/lib/routing/routes-path';

vi.mock('~/redux/auth/hooks', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('NotFound', () => {
  const useAuthMock = vi.mocked(useAuth);
  const useNavigateMock = vi.mocked(useNavigate);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит 404 страницу', () => {
    useAuthMock.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });
    useNavigateMock.mockReturnValue(vi.fn());

    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText('Sorry, we couldn’t find the page you’re looking for.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /go back home/i })
    ).toBeInTheDocument();
  });

  it('навигация на главную для авторизованного пользователя', () => {
    const navigateMock = vi.fn();
    useAuthMock.mockReturnValue({
      user: {
        uid: 'dvfs',
        email: null,
        name: null,
      },
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });
    useNavigateMock.mockReturnValue(navigateMock);

    render(<NotFound />);
    fireEvent.click(screen.getByRole('button', { name: /go back home/i }));

    expect(navigateMock).toHaveBeenCalledWith(`/${ROUTES.main}`, {
      replace: true,
    });
  });

  it('навигация на домашнюю для неавторизованного пользователя', () => {
    const navigateMock = vi.fn();
    useAuthMock.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });
    useNavigateMock.mockReturnValue(navigateMock);

    render(<NotFound />);
    fireEvent.click(screen.getByRole('button', { name: /go back home/i }));

    expect(navigateMock).toHaveBeenCalledWith(`/${ROUTES.home}`, {
      replace: true,
    });
  });
});
