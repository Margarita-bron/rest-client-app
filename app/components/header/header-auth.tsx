import logo from '~/assets/logo.png';
import { useState } from 'react';
import { SingInButton } from '~/components/sing-in-button/sing-in-button';
import { SingUpButton } from '~/components/sing-up-button/sing-up-button';

export const HeaderAuth = () => {
  const [isEnglish, setIsEnglish] = useState(true);

  const toggleLanguage = () => {
    setIsEnglish((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <a
          href="/"
          className="flex items-center transition-transform hover:scale-105"
        >
          <img src={logo} alt="Logo" className="h-8 mr-3" />
          <span className="text-l font-semibold text-gray-800">
            MVA Project
          </span>
        </a>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-full bg-gray-200 p-0.5 transition-colors hover:bg-gray-300"
          >
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                !isEnglish ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              RU
            </span>

            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                isEnglish ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              EN
            </span>
          </button>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-3">
            <SingInButton />
            <SingUpButton />
          </div>
        </div>
      </div>
    </header>
  );
};
