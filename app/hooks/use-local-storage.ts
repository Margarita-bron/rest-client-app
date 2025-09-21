import { useCallback } from 'react';

export function useLocalStorage<T>(key: string) {
  const getValue = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : null;
    } catch (error) {
      return null;
    }
  }, [key]);

  const setValue = useCallback(
    (value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        return null;
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      return null;
    }
  }, [key]);

  return { getValue, setValue, removeValue };
}
