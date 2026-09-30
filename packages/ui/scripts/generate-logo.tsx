import { mkdirSync, writeFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FuncdLogo from '../src/atoms/logo/funcd-logo';
import FuncdWordmark from '../src/atoms/logo/funcd-wordmark';

const directory = new URL('../assets/', import.meta.url);
const destination = new URL('funcd-logo.svg', directory);
const svg = renderToStaticMarkup(<FuncdLogo size={512} />);
const wordmarkDestination = new URL('funcd-wordmark.svg', directory);
const wordmarkSvg = renderToStaticMarkup(
  <FuncdWordmark width={398} height={81} />
);

mkdirSync(directory, { recursive: true });
writeFileSync(destination, `${svg}\n`);
writeFileSync(wordmarkDestination, `${wordmarkSvg}\n`);
