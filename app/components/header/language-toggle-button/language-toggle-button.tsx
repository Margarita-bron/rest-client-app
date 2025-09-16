import { useToggleLanguage } from '~/lib/i18n/hooks/use-toggle-language';

export function LanguageToggleButton() {
  const { locale, toggleLanguage } = useToggleLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 rounded-full bg-gray-300 p-0.5 transition-colors hover:bg-gray-300 hover:cursor-pointer"
    >
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
          locale === 'ru'
            ? 'bg-indigo-500 hover:bg-indigo-600 text-gray-100'
            : 'text-gray-600'
        }`}
      >
        RU
      </span>
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
          locale === 'en'
            ? 'bg-indigo-500 hover:bg-indigo-600 text-gray-100'
            : 'text-gray-600'
        }`}
      >
        EN
      </span>
    </button>
  );
}
