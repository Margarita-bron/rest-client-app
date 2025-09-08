export const BASE_ROUTES = {
  home: '',
  welcome: 'welcome',
  restClient: 'rest-client',
  history: 'history',
  variables: 'variables',
  signIn: 'sign-in',
  signUp: 'sign-up',
} as const;

export const ROUTES = {
  home: `/${BASE_ROUTES.home}`,
  welcome: `/${BASE_ROUTES.welcome}`,
  restClient: `/${BASE_ROUTES.restClient}`,
  history: `/${BASE_ROUTES.history}`,
  variables: `/${BASE_ROUTES.variables}`,
  signIn: `/${BASE_ROUTES.signIn}`,
  signUp: `/${BASE_ROUTES.signUp}`,
} as const;
