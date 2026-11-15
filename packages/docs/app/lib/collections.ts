import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { applyMdxPreset } from 'fumadocs-mdx/config';
import { defineDocs } from 'fumadocs-mdx/macro';
import remarkDirective from 'remark-directive';
import { cedarGrammar } from './cedar-grammar';
import { rehypeLangTabs } from './rehype-lang-tabs';

// The guide sits in funcd's mirrored layout (scripts/sync-content.ts). Its
// ::include lines are directives, which remark parses only with
// remark-directive (funcd ADR-0325). Its TypeScript and Python sections
// become tabs (rehype-lang-tabs.ts). A cedar block is highlighted with
// cedar-grammar.ts, since Shiki ships no Cedar grammar. The collection and
// the copies' URLs live apart from source.ts, which reads files, so that a
// page's component can import them in the browser.
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

// What an LLM reads (llms.txt, llms-full.txt and each page's markdown copy) links absolute paths under the site's base.
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const markdownUrl = (url: string) => `${base}${url}.md`;
