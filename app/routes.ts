import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('welcome', 'pages/welcome/welcome.tsx'),
    route('rest-client', 'pages/rest-client/rest-client.tsx'),
    route('history', 'pages/history/history.tsx'),
    route('variables', 'pages/variables/variables.tsx'),
] satisfies RouteConfig;
