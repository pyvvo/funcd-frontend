import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractCodeRegion } from 'fumadocs-core/mdx-plugins/remark-include';
import { getSlugs } from 'fumadocs-core/source';
import { includesOf } from './includes';

// After the build, every page must show what it includes (funcd ADR-0325). An
// ::include line left as text means the include did not run, a code block that
// differs from its file's region means the page shows something else, and a
// repo fetched at another tag than funcd's go.mod pins means another version.
const mirror = fileURLToPath(new URL('../content/funcd', import.meta.url));
const guide = join(mirror, 'docs/guide');
const client = fileURLToPath(new URL('../build/client', import.meta.url));
const problems: string[] = [];

for await (const file of glob(['**/*.html', '**/*.md'], { cwd: client })) {
  if (readFileSync(join(client, file), 'utf8').includes('::include[')) {
    problems.push(`${file} still holds an ::include line`);
  }
}

const fences = (markdown: string) =>
  [...markdown.matchAll(/^(`{3,}|~{3,})[^\n]*\n([\s\S]*?)\n\1$/gm)].map(
    ([, , body]) => body
  );

for (const { page, target, region } of await includesOf(guide)) {
  // An included Markdown file becomes part of the page, not a code block.
  if (/\.mdx?$/.test(target)) continue;
  const entry = relative(guide, page);
  const name = `${relative(mirror, target)}${region ? `#${region}` : ''}`;
  const copy = join(client, 'docs', `${getSlugs(entry).join('/')}.md`);
  if (!existsSync(copy)) {
    problems.push(`${entry}: no Markdown copy at ${relative(client, copy)}`);
    continue;
  }
  const source = readFileSync(target, 'utf8');
  // fumadocs drops a whole file's last newline when it embeds the file.
  const block = region
    ? extractCodeRegion(source, region)
    : source.replace(/\n$/, '');
  if (block === undefined) {
    problems.push(`${entry}: ${name} names a region its file does not mark`);
  } else if (!fences(readFileSync(copy, 'utf8')).includes(block)) {
    problems.push(`${entry}: no code block equal to ${name}`);
  }
}

const goMod = readFileSync(join(mirror, 'go.mod'), 'utf8');
const repos = join(mirror, '_repos');
for (const name of existsSync(repos) ? readdirSync(repos) : []) {
  const tag = readFileSync(join(repos, name, '.tag'), 'utf8').trim();
  const pin = goMod.match(
    new RegExp(`^\\s*github\\.com/pyvvo/${name}\\s+(v\\S+)`, 'm')
  );
  if (pin?.[1] !== tag) {
    problems.push(
      `_repos/${name} was fetched at ${tag}, but funcd's go.mod pins ${pin?.[1]}`
    );
  }
}

if (problems.length > 0) {
  console.error(
    `includes: ${problems.length} problem(s)\n${problems.join('\n')}`
  );
  process.exit(1);
}
console.log('includes: every page shows what it includes');
