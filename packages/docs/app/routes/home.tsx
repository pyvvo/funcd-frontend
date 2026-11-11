import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link } from 'react-router';
import { homeOptions } from '../lib/layout.shared';
import type { Route } from './+types/home';

export const meta: Route.MetaFunction = () => [{ title: 'funcd' }];

export default function Home() {
  return (
    <HomeLayout {...homeOptions()}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">funcd</h1>
        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to="/docs">
          Open the docs
        </Link>
      </div>
    </HomeLayout>
  );
}
