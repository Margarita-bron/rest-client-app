import { useEffect, useState } from 'react';
import { HeaderAuth } from '~/components/header/header-auth';
import { HeaderGuest } from '~/components/header/header-guest';
import { HeaderSkeleton } from '~/components/header/header-skeleton';
import { HEADER_TEST_IDS } from '~/components/header/header-test-ids';
import { useAuth } from '~/redux/auth/hooks';

export const Header = () => {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <div className="h-20" />

      <div
        data-testid={HEADER_TEST_IDS.header}
        className={`
          fixed top-0 left-0 w-full z-50 border-b border-gray-700
          bg-gray-800
          transition-all duration-200
          ${scrolled ? 'h-16' : 'h-20 bg-gray-950 border-gray-600'}
        `}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 h-full">
          {loading ? (
            <HeaderSkeleton />
          ) : user ? (
            <HeaderAuth />
          ) : (
            <HeaderGuest />
          )}
        </div>
      </div>
    </header>
  );
};
