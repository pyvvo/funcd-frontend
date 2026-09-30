import { mkdirSync, writeFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import FuncdLogo from '../src/atoms/logo/funcd-logo';
import FuncdWordmark from '../src/atoms/logo/funcd-wordmark';

// Each asset is its component rendered to a standalone SVG file.
const directory = new URL('../assets/', import.meta.url);
const assets = [
  { file: 'funcd-logo.svg', element: <FuncdLogo size={512} /> },
  {
    file: 'funcd-wordmark.svg',
    element: <FuncdWordmark width={398} height={81} />
  }
];

mkdirSync(directory, { recursive: true });
assets.forEach(({ file, element }) => {
  writeFileSync(new URL(file, directory), `${renderToStaticMarkup(element)}\n`);
});
