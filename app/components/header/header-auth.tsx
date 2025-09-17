import logo from '~/assets/logo.png';
import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';
import { SignOutButton } from '~/components/header/sign-out-button/sign-out-button';
import { LanguageToggleButton } from '~/components/header/language-toggle-button/language-toggle-button';
import { MainPageButton } from '~/components/header/main-page-button/main-page-button';

export const HeaderAuth = () => {
  return (
    <>
      <Link
        to={ROUTES.welcome}
        className="flex items-center transition-transform hover:scale-105"
      >
        <img src={logo} alt="Logo" className="h-8 mr-3" />
        <span className="text-l font-semibold text-gray-300">MVA Project</span>
      </Link>

      <div className="flex items-center gap-4">
        <LanguageToggleButton />

        <div className="h-6 w-px bg-gray-300" />
        <MainPageButton />
        <SignOutButton />
      </div>
    </>
  );
};
