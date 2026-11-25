import { cpSync, existsSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// React Router writes its SPA fallback beside the pre-rendered pages. It becomes
// GitHub Pages' 404 page, which renders the site's own "Not found".
const client = fileURLToPath(new URL('../build/client/', import.meta.url));
renameSync(`${client}__spa-fallback.html`, `${client}404.html`);

// Each page's markdown copy, pre-rendered under llms.mdx/, goes beside the page: llms.mdx/docs/a/b.md becomes docs/a/b.md.
const copies = `${client}llms.mdx/`;
if (existsSync(copies)) {
  cpSync(copies, client, { recursive: true });
  rmSync(copies, { recursive: true, force: true });
}
