import type { Config } from '@react-router/dev/config';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';
import { glob } from 'node:fs/promises';
import { apiSource } from './app/lib/openapi';

const getUrl = createGetUrl('/docs');

// GitHub Pages serves files only, so every page is pre-rendered at build time:
// the guide's, the API reference's and each one's markdown copy. The site is
// funcd's Pages site, at funcd.dev.
export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const paths = [...getStaticPaths(), '/llms.txt', '/llms-full.txt'];
    for await (const entry of glob(['**/*.md', '**/*.mdx'], {
      cwd: 'content/funcd/docs/guide'
    })) {
      const url = getUrl(getSlugs(entry));
      paths.push(url, `/llms.mdx${url}.md`);
    }
    for (const file of (await apiSource()).files) {
      const url = getUrl(getSlugs(file.path));
      paths.push(url, `/llms.mdx${url}.md`);
    }
    return [...new Set(paths)];
  }
} satisfies Config;
