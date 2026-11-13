import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { languages } from '../app/lib/rehype-lang-tabs';

// After the build, no page shows a TypeScript or Python heading: each run of
// them became one tab group (app/lib/rehype-lang-tabs.ts), while the page's
// Markdown copy keeps the headings. At least one page shows the tabs.
const client = fileURLToPath(new URL('../build/client', import.meta.url));
const names = languages.join('|');
const heading = /<h([2-6])\b[^>]*>([\s\S]*?)<\/h\1>/g;
const trigger = new RegExp(
  `role="tab"[^>]*>(?:<[^>]*>)*\\s*(${names})\\s*<`,
  'g'
);
const problems: string[] = [];
let tabbed = 0;

// A heading's first piece of text is its name: an anchor link's label follows it.
const nameOf = (inner: string) =>
  inner
    .split(/<[^>]*>/)
    .map((t) => t.trim())
    .find(Boolean);

for (const file of readdirSync(client, { recursive: true, encoding: 'utf8' })) {
  if (!file.endsWith('.html')) continue;
  const html = readFileSync(join(client, file), 'utf8');
  for (const [, , inner] of html.matchAll(heading)) {
    const name = nameOf(inner);
    if (name && languages.includes(name)) {
      problems.push(`${file} shows a ${name} heading instead of a tab`);
    }
  }
  const shown = new Set([...html.matchAll(trigger)].map(([, l]) => l));
  if (languages.every((l) => shown.has(l))) tabbed++;
}

if (tabbed === 0) problems.push('no page shows TypeScript and Python tabs');
if (problems.length > 0) {
  console.error(
    `lang-tabs: ${problems.length} problem(s)\n${problems.join('\n')}`
  );
  process.exit(1);
}
console.log(`lang-tabs: ${tabbed} page(s) show language tabs, no heading left`);
