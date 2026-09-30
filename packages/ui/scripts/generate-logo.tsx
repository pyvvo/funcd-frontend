import { mkdirSync, writeFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FuncdLogo from '../src/atoms/logo/funcd-logo';

const directory = new URL('../assets/', import.meta.url);
const destination = new URL('funcd-logo.svg', directory);
const svg = renderToStaticMarkup(<FuncdLogo size={512} />);

mkdirSync(directory, { recursive: true });
writeFileSync(destination, `${svg}\n`);
