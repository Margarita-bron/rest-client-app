import { SignInButton } from '~/components/buttons/sign-in-button/sign-in-button';
import { SignUpButton } from '~/components/buttons/sign-up-button/sign-up-button';
import { useTr } from '~/lib/i18n/hooks/use-translate-custom';
import githubLogo from '~/assets/github.svg';

export const Auth = () => {
  const t = useTr('guestPage');
  const developers = ['dev1', 'dev2', 'dev3'];

  return (
    <div className="flex-1 container mx-auto flex flex-col justify-center items-center px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-100 text-center">
        {t('welcome')}
      </h1>

      <div className="flex flex-col md:flex-row w-full max-w-5xl gap-10">
        <div className="flex-1 flex flex-col gap-6 bg-gray-900 p-6 rounded-xl shadow-md text-left">
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-200">
              {t('aboutProject.title')}
            </h2>
            <p className="text-base text-gray-400 leading-relaxed">
              {t('aboutProject.text')}
            </p>
          </section>
          <div className="mt-4">
            <a
              href="https://github.com/Margarita-bron/rest-client-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-xl"
            >
              <img src={githubLogo} alt="GitHub Logo" className="w-6 h-6" />
              {t('aboutProject.source')}
            </a>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 bg-gray-900 p-6 rounded-xl shadow-md text-left">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-gray-200">
              {t('aboutCourse.title')}
            </h2>
            <p className="text-base text-gray-400 leading-relaxed">
              {t('aboutCourse.text')}{' '}
              <a
                href="https://rs.school/courses/reactjs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                RS School: React
              </a>
              .
            </p>
          </section>

          <h2 className="text-2xl font-semibold text-gray-200">
            {t('developers.title')}
          </h2>
          <ul className="flex flex-col gap-3">
            {developers.map((dev) => (
              <li key={dev}>
                <a
                  href={`https://github.com/${t(`developers.${dev}.github`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
                >
                  <img src={githubLogo} alt="GitHub Logo" className="w-5 h-5" />
                  {t(`developers.${dev}.name`)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 max-w-5xl bg-gray-900 p-6 rounded-xl shadow-md mt-12 flex items-center justify-center gap-6 scale-125">
        <SignInButton />
        <SignUpButton />
      </div>
    </div>
  );
};
