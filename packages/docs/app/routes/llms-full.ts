import { docsLlms } from '../lib/source';

// Every page's markdown in one file, for an LLM that reads the whole guide at once.
export async function loader() {
  return new Response(await docsLlms.full(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
