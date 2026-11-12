import type { LoaderFunctionArgs } from 'react-router';
import { docsLlms, source } from '../lib/source';

// A page's markdown copy, pre-rendered at /llms.mdx/docs/<slugs>.md; the build moves it beside the page, to
// /docs/<slugs>.md (scripts/pages-layout.ts).
export async function loader({ params }: LoaderFunctionArgs) {
  const slugs = (params['*'] ?? '')
    .replace(/\.md$/, '')
    .replace(/^docs\/?/, '')
    .split('/')
    .filter(Boolean);
  const page = source.getPage(slugs);
  if (!page) throw new Response('Not found', { status: 404 });
  return new Response(await docsLlms.page(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  });
}
