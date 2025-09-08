import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('welcome', 'routes/welcome.tsx'),
  route('rest-client', 'routes/rest-client.tsx'),
  route('history', 'routes/history.tsx'),
  route('variables', 'routes/variables.tsx'),
  route('sign-in', 'routes/sign-in.tsx'),
  route('sign-up', 'routes/sign-up.tsx'),
] satisfies RouteConfig;
