import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '../lib/source';

const server = createFromSource(source, { language: 'english' });

// The index is written once at build time, and the browser searches it.
export async function loader() {
  return server.staticGET();
}
