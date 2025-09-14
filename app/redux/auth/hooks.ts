import { useSelector } from 'react-redux';
import type { RootState } from '~/redux/store';

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
};
