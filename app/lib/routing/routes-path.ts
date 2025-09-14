export const ROUTES = {
  home: '',
  welcome: 'welcome',
  restClient: 'rest-client',
  history: 'history',
  variables: 'variables',
  signIn: 'sign-in',
  signUp: 'sign-up',
  reset: 'reset',
} as const;

export const routing = {
  locales: ['en', 'ru'] as const,
  defaultLocale: 'en',
  baseRoutes: ROUTES,
} as const;

export type Locale = (typeof routing.locales)[number];
