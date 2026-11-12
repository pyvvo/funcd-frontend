import { docsLlms } from '../lib/source';

// The site's llms.txt (llmstxt.org): every page, linked to its markdown copy.
export async function loader() {
  return new Response(docsLlms.index(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
