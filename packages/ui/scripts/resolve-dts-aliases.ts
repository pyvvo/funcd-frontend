import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// After `tsc -p tsconfig.build.json`: tsc writes each declaration's imports as
// the source has them, and the source imports through the `@/` alias, which
// only this package resolves (tsconfig.json's paths). An app finds no module
// there and types every such import as `any`, so each one becomes the relative
// path of the declaration that dist holds for it.
const dist = fileURLToPath(new URL('../dist', import.meta.url));
const aliased = /(\bfrom\s*|\bimport\s*\(\s*)(['"])@\/([^'"]+)\2/g;
let declarations = 0;
let imports = 0;

for (const file of readdirSync(dist, { recursive: true, encoding: 'utf8' })) {
  if (!file.endsWith('.d.ts')) continue;
  const path = join(dist, file);
  const text = readFileSync(path, 'utf8');
  const resolved = text.replace(
    aliased,
    (_, keyword: string, quote: string, target: string) => {
      imports++;
      const to = relative(dirname(path), join(dist, target))
        .split('\\')
        .join('/');
      return `${keyword}${quote}${to.startsWith('.') ? to : `./${to}`}${quote}`;
    }
  );
  if (resolved !== text) {
    declarations++;
    writeFileSync(path, resolved);
  }
}

console.log(`resolved ${imports} @/ imports in ${declarations} declarations`);
