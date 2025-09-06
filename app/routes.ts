import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('welcome', 'routes/welcome.tsx'),
  route('rest-client', 'routes/rest-client.tsx'),
  route('history', 'routes/history.tsx'),
  route('variables', 'routes/variables.tsx'),
  route('register', 'routes/register.tsx'),
  route('reset', 'routes/reset.tsx'),
  route('sing-in', 'routes/sing-in.tsx'),
  route('sing-up', 'routes/sing-up.tsx'),
] satisfies RouteConfig;
