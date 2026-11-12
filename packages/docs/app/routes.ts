import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('docs/*', 'routes/docs.tsx'),
  route('llms.txt', 'routes/llms.ts'),
  route('llms-full.txt', 'routes/llms-full.ts'),
  route('llms.mdx/*', 'routes/llms-page.ts'),
  route('api/search', 'routes/search.ts'),
  route('favicon.svg', 'routes/favicon.tsx'),
  route('*', 'routes/not-found.tsx')
] satisfies RouteConfig;
