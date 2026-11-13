import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// After the build, every page's markdown copy links other pages by absolute
// URL (app/lib/source.ts): a relative link would resolve from the copy's own
// URL, not from the page's file, and point at the wrong place. A link to
// another copy names one that the build wrote.
const client = fileURLToPath(new URL('../build/client', import.meta.url));
const fence = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1$/gm;
const relative = /\]\(<?(?![a-z][a-z+.-]*:|\/|#)([^)\s<>]+)>?\)/gi;
const copy = /\]\(\/[^/)\s]+\/(docs\/[^)#\s]+\.md)(?:#[^)\s]*)?\)/g;
const problems: string[] = [];
let copies = 0;

for (const file of readdirSync(join(client, 'docs'), {
  recursive: true,
  encoding: 'utf8'
})) {
  if (!file.endsWith('.md')) continue;
  copies++;
  const text = readFileSync(join(client, 'docs', file), 'utf8').replace(
    fence,
    ''
  );
  for (const [, href] of text.matchAll(relative)) {
    problems.push(`docs/${file} links ${href}, a relative path`);
  }
  for (const [, target] of text.matchAll(copy)) {
    if (!existsSync(join(client, target))) {
      problems.push(
        `docs/${file} links ${target}, which the build did not write`
      );
    }
  }
}

if (problems.length > 0) {
  console.error(
    `md-links: ${problems.length} problem(s)\n${problems.join('\n')}`
  );
  process.exit(1);
}
console.log(`md-links: ${copies} markdown copies link by absolute URL`);
