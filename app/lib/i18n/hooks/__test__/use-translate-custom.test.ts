import { renderHook } from '@testing-library/react';
import { useTr } from '../use-translate-custom';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const name =
        options && typeof options['name'] === 'string'
          ? options['name']
          : undefined;
      return name ? `${key}:${name}` : key;
    },
  }),
}));

describe('useTr', () => {
  it('prepends namespace if provided', () => {
    const { result } = renderHook(() => useTr('Header'));
    const t = result.current;

    const translated = t('signOut');

    expect(translated).toBe('Header.signOut');
  });

  it('works without namespace', () => {
    const { result } = renderHook(() => useTr());
    const t = result.current;

    const translated = t('welcome');

    expect(translated).toBe('welcome');
  });

  it('passes options to t', () => {
    const { result } = renderHook(() => useTr('Header'));
    const t = result.current;

    const translated = t('authorName', { name: 'Alice' });

    expect(translated).toBe('Header.authorName:Alice');
  });

  it('returns correct typed value', () => {
    const { result } = renderHook(() => useTr('Header'));
    const t = result.current;

    const translated: string = t('signOut');
    expect(translated).toBe('Header.signOut');
  });
});
