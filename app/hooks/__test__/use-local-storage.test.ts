import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLocalStorage } from '~/hooks/use-local-storage';

describe('useLocalStorage', () => {
  const KEY = 'test-key';

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns null if nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorage<string>(KEY));
    expect(result.current.getValue()).toBeNull();
  });

  it('sets and gets a value correctly', () => {
    const { result } = renderHook(() => useLocalStorage<string>(KEY));

    act(() => {
      result.current.setValue('hello');
    });

    expect(localStorage.getItem(KEY)).toBe(JSON.stringify('hello'));
    expect(result.current.getValue()).toBe('hello');
  });

  it('removes a value correctly', () => {
    localStorage.setItem(KEY, JSON.stringify('toRemove'));
    const { result } = renderHook(() => useLocalStorage<string>(KEY));

    act(() => {
      result.current.removeValue();
    });

    expect(localStorage.getItem(KEY)).toBeNull();
    expect(result.current.getValue()).toBeNull();
  });

  it('returns null if stored value is invalid JSON', () => {
    localStorage.setItem(KEY, 'invalid-json');
    const { result } = renderHook(() => useLocalStorage<string>(KEY));
    expect(result.current.getValue()).toBeNull();
  });

  it('does not throw if localStorage methods throw', () => {
    const mockError = new Error('Storage error');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw mockError;
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw mockError;
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw mockError;
    });

    const { result } = renderHook(() => useLocalStorage<string>(KEY));

    expect(result.current.getValue()).toBeNull();
    act(() => result.current.setValue('x'));
    act(() => result.current.removeValue());
  });
});
