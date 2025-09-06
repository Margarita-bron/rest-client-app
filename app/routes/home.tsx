import type { Route } from './+types/home';
import { Auth } from '~/routes/auth';

export function meta({}: Route.MetaArgs) {
  return [{ name: 'description', content: 'Welcome to React Router!' }];
}

export default function Home() {
  return <Auth />;
}
