import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import NotFound from '~/routes/not-found';
import LangNotFound from '~/routes/lang-not-found';
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

describe('NotFound component', () => {
  const useAuthMock = vi.mocked(useAuth);
  const useNavigateMock = vi.mocked(useNavigate);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the 404 page content', () => {
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

  it('navigates to main route for authenticated user', () => {
    const navigateMock = vi.fn();
    useAuthMock.mockReturnValue({
      user: { uid: '123', email: 'a@b.com', name: 'Test User' },
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: true,
    });
    useNavigateMock.mockReturnValue(navigateMock);

    render(<NotFound />);
    fireEvent.click(screen.getByRole('button', { name: /go back home/i }));

    expect(navigateMock).toHaveBeenCalledWith(`/${ROUTES.main}`, {
      replace: true,
    });
  });

  it('navigates to home route for unauthenticated user', () => {
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

describe('LangNotFound component', () => {
  const useAuthMock = vi.mocked(useAuth);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the 404 page content', () => {
    useAuthMock.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });

    render(<LangNotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText('Sorry, we couldn’t find the page you’re looking for.')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go back home/i })
    ).toBeInTheDocument();
  });

  it('links to main route for authenticated user', () => {
    useAuthMock.mockReturnValue({
      user: { uid: '123', email: 'a@b.com', name: 'Test User' },
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: true,
    });

    render(<LangNotFound />);
    const link = screen.getByRole('link', { name: /go back home/i });
    expect(link).toHaveAttribute('href', '/en/main');
  });

  it('links to home route for unauthenticated user', () => {
    useAuthMock.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      firestoreProfile: null,
      isAuthenticated: false,
    });

    render(<LangNotFound />);
    const link = screen.getByRole('link', { name: /go back home/i });
    expect(link).toHaveAttribute('href', '/en');
  });
});
