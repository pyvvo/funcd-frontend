import { FuncdLogo } from '@funcd-dev/ui/logo';
import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { Download, Rocket } from 'lucide-react';
import { createElement, type ReactElement } from 'react';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: { async: true }
});

// The icons a page may name in its `icon` frontmatter. Only these are bundled,
// not the whole Lucide set; `Funcd` is the funcd mark, without the wordmark.
const icons: Record<string, () => ReactElement> = {
  Download: () => createElement(Download),
  Funcd: () => createElement(FuncdLogo, { color: 'currentColor' }),
  Rocket: () => createElement(Rocket)
};

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
  icon: (name) => (name && name in icons ? icons[name]() : undefined)
});
