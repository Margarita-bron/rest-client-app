import logo from '~/assets/logo.png';
import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { SignInButton } from '~/components/buttons/sign-in-button/sign-in-button';
import { SignUpButton } from '~/components/buttons/sign-up-button/sign-up-button';
import { LanguageToggleButton } from '~/components/header/language-toggle-button/language-toggle-button';

export const HeaderGuest = () => {
  return (
    <>
      <Link
        to={ROUTES.home}
        className="flex items-center transition-transform hover:scale-105"
      >
        <img src={logo} alt="Logo" className="h-8 mr-3" />
        <span className="text-l font-semibold text-gray-300">
          REST Client App
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
    </>
  );
};
