export const ROUTES = {
  home: '',
  main: 'main',
  restClient: 'rest-client',
  history: 'history',
  variables: 'variables',
  signIn: 'sign-in',
  signUp: 'sign-up',
  reset: 'reset',
} as const;

export const Locale = Object.freeze({
  en: 'en',
  ru: 'ru',
});

export type Locale = (typeof Locale)[keyof typeof Locale];

export const routing = {
  locales: Object.values(Locale) as Locale[],
  defaultLocale: Locale.en,
  baseRoutes: ROUTES,
} as const;
