import { FuncdLogo } from '@funcd-dev/ui/logo';
import type { Node } from 'fumadocs-core/page-tree';
import { llms, loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import {
  Activity,
  Blocks,
  Boxes,
  Database,
  Download,
  Gauge,
  Layers,
  LifeBuoy,
  Network,
  Rocket,
  ShieldCheck,
  SlidersHorizontal,
  Zap
} from 'lucide-react';
import { createElement, type ReactElement } from 'react';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: { async: true, postprocess: { includeProcessedMarkdown: true } }
});

// The icons a page may name in its `icon` frontmatter. Only these are bundled,
// not the whole Lucide set; `Funcd` is the funcd mark, without the wordmark.
const icons: Record<string, () => ReactElement> = {
  Activity: () => createElement(Activity),
  Blocks: () => createElement(Blocks),
  Boxes: () => createElement(Boxes),
  Database: () => createElement(Database),
  Download: () => createElement(Download),
  Funcd: () => createElement(FuncdLogo, { color: 'currentColor' }),
  Gauge: () => createElement(Gauge),
  Layers: () => createElement(Layers),
  LifeBuoy: () => createElement(LifeBuoy),
  Network: () => createElement(Network),
  Rocket: () => createElement(Rocket),
  ShieldCheck: () => createElement(ShieldCheck),
  SlidersHorizontal: () => createElement(SlidersHorizontal),
  Zap: () => createElement(Zap)
};

// A feature folder holds its Usage tab (index.md) and its Spec tab (spec.md). The sidebar shows the feature as one
// entry, its Usage page; routes/docs.tsx shows the two tabs.
function collapseFeatures(nodes: Node[]): Node[] {
  return nodes.map((node) => {
    if (node.type !== 'folder') return node;
    const pages = node.children.filter((child) => child.type === 'page');
    const usage =
      node.index ?? pages.find((page) => !page.url.endsWith('/spec'));
    const spec = pages.find((page) => page.url === `${usage?.url}/spec`);
    const others = node.children.filter(
      (child) => child !== usage && child !== spec
    );
    if (usage && spec && others.length === 0)
      return { ...usage, name: node.name, icon: node.icon ?? usage.icon };
    return { ...node, children: collapseFeatures(node.children) };
  });
}

const options = {
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
  icon: (name?: string) => (name && name in icons ? icons[name]() : undefined)
};

export const source = loader({
  ...options,
  pageTree: {
    transformers: [
      {
        root: (root) => ({ ...root, children: collapseFeatures(root.children) })
      }
    ]
  }
});

// What an LLM reads (llms.txt, llms-full.txt and each page's markdown copy) links absolute paths under the site's base.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const markdownUrl = (url: string) => `${base}${url}.md`;

// llms.txt lists every page, the Spec tabs included: it reads the tree before the sidebar folds each feature.
export const docsLlms = llms(loader(options), {
  renderUrl: (node) => markdownUrl(node.url),
  renderPage: async (page) =>
    [
      `# ${page.data.title}`,
      `URL: ${base}${page.url}`,
      page.data.description ?? '',
      await page.data.getText('processed')
    ]
      .filter(Boolean)
      .join('\n\n')
});
