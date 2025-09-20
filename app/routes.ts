import { route, index } from '@react-router/dev/routes';
import { ROUTES } from './lib/routing/routes-path';

export default [
  index('routes/lang-redirect.tsx'),

  route(':lang', 'routes/$lang.tsx', [
    route('', 'routes/__layout.tsx', [
      route('', 'routes/__is-not-logged.tsx', [
        index('routes/home.tsx'),

        route(ROUTES.signIn, 'routes/sign-in.tsx'),
        route(ROUTES.signUp, 'routes/sign-up.tsx'),
        route(ROUTES.reset, 'routes/reset.tsx'),
      ]),

      route('', 'routes/__private.tsx', [
        route(ROUTES.main, 'routes/main.tsx'),
        route(ROUTES.history, 'routes/history.tsx'),
        route(ROUTES.variables, 'routes/variables.tsx'),
        route('rest-client', 'routes/rest-client.tsx'),
        route(':method/:url', 'routes/rest-client-method-url.tsx'),
        route(':method/:url/:body', 'routes/rest-client-method-url-body.tsx'),
      ]),
    ]),

    route('*', 'routes/lang-not-found.tsx'),
  ]),

  route('*', 'routes/not-found.tsx'),
];
