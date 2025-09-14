import { SignInButton } from '../sign-in-button/sign-in-button';
import { SignUpButton } from '../sign-up-button/sign-up-button';
import logo from '~/assets/logo.png';
import { useState } from 'react';
import { Link } from '~/lib/routing/navigation';
import { ROUTES } from '~/lib/routing/routes-path';

export const HeaderGuest = () => {
  const [isEnglish, setIsEnglish] = useState(true);

  const toggleLanguage = () => {
    setIsEnglish((prev) => !prev);
  };

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
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-full bg-gray-300 p-0.5 transition-colors hover:bg-gray-300"
          >
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                !isEnglish ? 'bg-indigo-500 text-gray-100' : 'text-gray-600'
              }`}
            >
              RU
            </span>

            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                isEnglish ? 'bg-indigo-500 text-gray-100' : 'text-gray-600'
              }`}
            >
              EN
            </span>
          </button>

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
