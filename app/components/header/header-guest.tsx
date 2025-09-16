import logo from '~/assets/logo.png';
import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { SignInButton } from '~/components/header/sign-in-button/sign-in-button';
import { SignUpButton } from '~/components/header/sign-up-button/sign-up-button';
import { LanguageToggleButton } from '~/components/header/language-toggle-button/language-toggle-button';

export const HeaderGuest = () => {
  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          to={ROUTES.home}
          className="flex items-center transition-transform hover:scale-105"
        >
          <img src={logo} alt="Logo" className="h-8 mr-3" />
          <span className="text-l font-semibold text-gray-300">
            MVA Project
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageToggleButton />

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-3">
            <SignInButton />
            <SignUpButton />
          </div>
        </div>
      </div>
    </header>
  );
};
