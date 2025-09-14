import type { User } from 'firebase/auth';

const STORAGE_KEY = 'user';

export const localStorageUser = {
  get: (): User | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch (error) {
      console.warn('Error reading user from localStorage:', error);
      return null;
    }
  },

  set: (user: User | null) => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Error writing user to localStorage:', error);
    }
  },

  remove: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Error removing user from localStorage:', error);
    }
  },
};
