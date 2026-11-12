import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

export type Include = { page: string; target: string; region?: string };

const directive = /^::include\[([^\]]+)\]\s*$/gm;

// includesOf lists every ::include line of the pages under guide, its path
// resolved against the page's folder, as fumadocs resolves it.
export const includesOf = async (guide: string): Promise<Include[]> => {
  const found: Include[] = [];
  for await (const entry of glob(['**/*.md', '**/*.mdx'], { cwd: guide })) {
    const page = join(guide, entry);
    for (const [, spec] of readFileSync(page, 'utf8').matchAll(directive)) {
      const [path, region] = spec.split('#');
      found.push({ page, target: resolve(dirname(page), path), region });
    }
  }
  return found;
};
