import { renderHook, act } from '@testing-library/react';
import { useToggleLanguage } from '../use-toggle-language';
import * as router from 'react-router';
import { Locale, routing } from '~/lib/routing/routes-path';
import { vi } from 'vitest';

describe('useToggleLanguage', () => {
  const navigateMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock);
    vi.spyOn(router, 'useLocation').mockReturnValue({
      pathname: '/en/some-path',
      search: '?q=test',
      hash: '#hash',
    } as router.Location);
    vi.spyOn(router, 'useParams').mockReturnValue({ lang: 'en' } as {
      lang?: string;
    });
  });

  it('returns current locale from URL', () => {
    const { result } = renderHook(() => useToggleLanguage());
    expect(result.current.locale).toBe(Locale.en);
  });

  it('toggles language from en to ru in the path', () => {
    const { result } = renderHook(() => useToggleLanguage());

    act(() => {
      result.current.toggleLanguage();
    });

    expect(navigateMock).toHaveBeenCalledWith('/ru/some-path?q=test#hash', {
      replace: true,
    });
  });

  it('toggles language from ru to en in the path', () => {
    vi.spyOn(router, 'useParams').mockReturnValue({ lang: 'ru' } as {
      lang?: string;
    });
    vi.spyOn(router, 'useLocation').mockReturnValue({
      pathname: '/ru/some-path',
      search: '',
      hash: '',
    } as router.Location);

    const { result } = renderHook(() => useToggleLanguage());

    act(() => {
      result.current.toggleLanguage();
    });

    expect(navigateMock).toHaveBeenCalledWith('/en/some-path', {
      replace: true,
    });
  });

  it('adds locale to path if missing', () => {
    vi.spyOn(router, 'useParams').mockReturnValue({ lang: undefined } as {
      lang?: string;
    });
    vi.spyOn(router, 'useLocation').mockReturnValue({
      pathname: '/some-path',
      search: '',
      hash: '',
    } as router.Location);

    const { result } = renderHook(() => useToggleLanguage());

    act(() => {
      result.current.toggleLanguage();
    });

    expect(navigateMock).toHaveBeenCalledWith('/ru/some-path', {
      replace: true,
    });
  });
});
