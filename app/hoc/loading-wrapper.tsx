import type { ReactNode } from 'react';
import { Loader } from '~/ui/loader';

type Props = {
  loading: boolean;
  children: ReactNode;
};

export const LoadingWrapper = ({ loading, children }: Props) => {
  if (loading) return <Loader />;
  return <>{children}</>;
};
