import './app.css';
import { RootProvider } from 'fumadocs-ui/provider/react-router';
import type { ReactNode } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData
} from 'react-router';
import type { Route } from './+types/root';
import SearchDialog from './components/search';
import { themeCss } from './lib/theme.server';

// Browsers that draw SVG icons take the last one; Safari takes the PNG.
const base = import.meta.env.BASE_URL;
export const links: Route.LinksFunction = () => [
  {
    rel: 'icon',
    href: `${base}favicon.png`,
    type: 'image/png',
    sizes: '32x32'
  },
  { rel: 'icon', href: `${base}favicon.svg`, type: 'image/svg+xml' },
  { rel: 'apple-touch-icon', href: `${base}apple-touch-icon.png` }
];

export const loader = () => ({ themeCss: themeCss() });

export function Layout({ children }: { children: ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {data && <style dangerouslySetInnerHTML={{ __html: data.themeCss }} />}
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ SearchDialog }}>{children}</RootProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
