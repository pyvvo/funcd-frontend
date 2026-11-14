import { FuncdLogo } from '@funcd-dev/ui/logo';
import type { Node } from 'fumadocs-core/page-tree';
import { llms, loader } from 'fumadocs-core/source';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { applyMdxPreset } from 'fumadocs-mdx/config';
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
import remarkDirective from 'remark-directive';
import { rehypeLangTabs } from './rehype-lang-tabs';
import { cedarGrammar } from './cedar-grammar';
import { pageHref } from './page-href';

// The guide sits in funcd's mirrored layout (scripts/sync-content.ts). Its
// ::include lines are directives, which remark parses only with
// remark-directive (funcd ADR-0325). Its TypeScript and Python sections
// become tabs (rehype-lang-tabs.ts). A cedar block is highlighted with
// cedar-grammar.ts, since Shiki ships no Cedar grammar.
export const docs = defineDocs({
  dir: 'content/funcd/docs/guide',
  docs: {
    async: true,
    postprocess: { includeProcessedMarkdown: true },
    mdxOptions: applyMdxPreset({
      remarkPlugins: [remarkDirective],
      rehypePlugins: [rehypeLangTabs],
      rehypeCodeOptions: { ...rehypeCodeDefaultOptions, langs: [cedarGrammar] }
    })
  }
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
// entry, its Usage page; routes/docs.tsx shows the two tabs. A feature whose Usage page is not written yet shows as
// one entry too, its Spec page.
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
    const [only] = node.children;
    if (
      !usage &&
      node.children.length === 1 &&
      only.type === 'page' &&
      only.url.endsWith('/spec')
    )
      return { ...only, name: node.name, icon: node.icon ?? only.icon };
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

// A markdown copy links another page by the absolute URL of that page's copy,
// as llms.txt does: the source links a file relative to the page (spec.md,
// ../platform/kv.md), which resolves wrongly from the copy's own URL. Code
// blocks keep their text.
const fence = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1$/gm;
const absoluteLinks = (markdown: string, pagePath: string) => {
  const relink = (text: string) =>
    text.replace(/\]\(<?([^)\s<>]+)>?\)/g, (whole, href: string) => {
      const resolved = pageHref(href, pagePath);
      if (resolved === href) return whole;
      const [url, hash] = resolved.split('#');
      return `](${markdownUrl(url)}${hash ? `#${hash}` : ''})`;
    });
  let out = '';
  let last = 0;
  for (const block of markdown.matchAll(fence)) {
    out += relink(markdown.slice(last, block.index)) + block[0];
    last = block.index + block[0].length;
  }
  return out + relink(markdown.slice(last));
};

// llms.txt lists every page, the Spec tabs included: it reads the tree before the sidebar folds each feature.
export const docsLlms = llms(loader(options), {
  renderUrl: (node) => markdownUrl(node.url),
  renderPage: async (page) =>
    [
      `# ${page.data.title}`,
      `URL: ${base}${page.url}`,
      page.data.description ?? '',
      absoluteLinks(await page.data.getText('processed'), page.path)
    ]
      .filter(Boolean)
      .join('\n\n')
});
