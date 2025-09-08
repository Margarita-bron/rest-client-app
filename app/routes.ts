import { type RouteConfig, index, route } from '@react-router/dev/routes';
// alias for react router framework mode not working, use local instead
import { ROUTES } from './routes-path';

export default [
  index('routes/home.tsx'),
  route(ROUTES.welcome, 'routes/welcome.tsx'),
  route(ROUTES.restClient, 'routes/rest-client.tsx'),
  route(ROUTES.history, 'routes/history.tsx'),
  route(ROUTES.variables, 'routes/variables.tsx'),
  route(ROUTES.signIn, 'routes/sign-in.tsx'),
  route(ROUTES.signUp, 'routes/sign-up.tsx'),
] satisfies RouteConfig;
