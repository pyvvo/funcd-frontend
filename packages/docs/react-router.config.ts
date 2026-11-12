import type { Config } from '@react-router/dev/config';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';
import { glob } from 'node:fs/promises';

const getUrl = createGetUrl('/docs');

// GitHub Pages serves files only, so every page is pre-rendered at build time.
// The site is funcd's Pages site, at pyvvo.github.io/funcd/.
export default {
  basename: '/funcd/',
  ssr: false,
  async prerender({ getStaticPaths }) {
    const paths = [...getStaticPaths(), '/llms.txt', '/llms-full.txt'];
    for await (const entry of glob(['**/*.md', '**/*.mdx'], {
      cwd: 'content/docs'
    })) {
      const url = getUrl(getSlugs(entry));
      paths.push(url, `/llms.mdx${url}.md`);
    }
    return [...new Set(paths)];
  }
} satisfies Config;
