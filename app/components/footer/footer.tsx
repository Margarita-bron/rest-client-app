import rsLogo from '~/assets/rss-logo.svg';
import githubLogo from '~/assets/github.svg';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';

export const Footer = () => {
  const t = useTr('footer');
  return (
    <footer className="bg-gray-950 border-t border-gray-800 relative">
      <div className="mx-auto max-w-7xl px-4 py-6 flex items-center">
        <a
          href="https://github.com/Margarita-bron/rest-client-app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-gray-400 transition-colors hover:opacity-90"
        >
          <img src={githubLogo} alt="GitHub Logo" className="w-5 h-5" />
          <span className="text-sm font-medium">{t('source')}</span>
        </a>
        <div className="absolute inset-x-0 text-center text-sm text-gray-400">
          {t('year')}
        </div>
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-2 text-gray-300 hover:text-gray-400 transition-colors"
        >
          <span className="text-sm font-medium">{t('course')}</span>
          <img src={rsLogo} alt="RS School Logo" className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
};
