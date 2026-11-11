import { cpSync, existsSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import config from '../react-router.config';

// GitHub Pages serves the build at pyvvo.github.io/funcd/, while React Router
// writes the pre-rendered pages under the basename (build/client/funcd/) and
// its SPA fallback beside it. The fallback becomes Pages' 404 page, which
// renders the site's own "Not found"; then the pages move up beside the
// assets, the home page as index.html.
const client = fileURLToPath(new URL('../build/client/', import.meta.url));
const pages = `${client}${config.basename?.replace(/^\/|\/$/g, '')}/`;

const fallback = ['index.html', '__spa-fallback.html']
  .map((name) => `${client}${name}`)
  .find((file) => existsSync(file));
if (fallback) renameSync(fallback, `${client}404.html`);
cpSync(pages, client, { recursive: true });
rmSync(pages, { recursive: true, force: true });
