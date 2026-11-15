import { FuncdLogo } from '@funcd-dev/ui/logo';
import type { Node } from 'fumadocs-core/page-tree';
import { llms, loader, update } from 'fumadocs-core/source';
import type {
  OperationObject,
  ParameterObject,
  RequestBodyObject
} from 'fumadocs-openapi';
import type { OpenAPIPageData } from 'fumadocs-openapi/server';
import {
  Activity,
  Blocks,
  BookOpen,
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
  SquareCode,
  Zap
} from 'lucide-react';
import { createElement, type ReactElement } from 'react';
import { base, docs, markdownUrl } from './collections';
import { answersOf, apiSource, casesOf, openapi, operationOf } from './openapi';
import { pageHref } from './page-href';

// The icons a page may name in its `icon` frontmatter, or a folder in its
// meta.json, such as the API reference's `SquareCode`; `BookOpen` marks the
// Documentation root. Only these are bundled, not the whole Lucide set;
// `Funcd` is the funcd mark, without the wordmark.
const icons: Record<string, () => ReactElement> = {
  Activity: () => createElement(Activity),
  Blocks: () => createElement(Blocks),
  BookOpen: () => createElement(BookOpen),
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
  SquareCode: () => createElement(SquareCode),
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

// The sidebar has two roots, which its switcher toggles, and shows the tree of
// the open page's root only (funcd ADR-0331): the API reference, a root folder
// by its meta.json, and the guide's other pages, wrapped here into the
// Documentation root. After a move to another page, the switcher finds a root
// by its $id, which fumadocs gives a folder from its path; this one has none.
function withRoots(nodes: Node[]): Node[] {
  const isRoot = (node: Node) => node.type === 'folder' && Boolean(node.root);
  return [
    {
      $id: 'documentation',
      type: 'folder',
      name: 'Documentation',
      description: 'Guides and concepts',
      root: true,
      icon: icons.BookOpen(),
      children: collapseFeatures(nodes.filter((node) => !isRoot(node)))
    },
    ...nodes.filter(isRoot)
  ];
}

// The site's search indexes a page's structured data. fumadocs-openapi's holds
// an operation's description only, so a page of the API reference adds its
// summary and the texts of each case, under its Answers table's heading.
const withCases = (data: OpenAPIPageData): OpenAPIPageData => {
  const { operation } = operationOf(data);
  return {
    ...data,
    structuredData: {
      headings: [
        ...data.structuredData.headings,
        { id: 'answers', content: 'Answers' }
      ],
      contents: [
        { heading: undefined, content: operation.summary ?? '' },
        ...data.structuredData.contents,
        ...casesOf(operation).map(({ when, fix }) => ({
          heading: 'answers',
          content: `${when} ${fix}`
        }))
      ]
    }
  };
};

const options = {
  source: {
    docs: docs.toFumadocsSource(),
    openapi: update(await apiSource())
      .page((file) => ({ ...file, data: withCases(file.data) }))
      .build()
  },
  baseUrl: '/docs',
  plugins: [openapi.loaderPlugin()],
  icon: (name?: string) => (name && name in icons ? icons[name]() : undefined)
};

export const source = loader({
  ...options,
  pageTree: {
    transformers: [
      {
        root: (root) => ({ ...root, children: withRoots(root.children) })
      }
    ]
  }
});

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

// A table cell holds one line, which a pipe would end.
const cell = (text = '') =>
  text.replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|');

// A schema with each component schema that it names written in its place, so
// that a copy holds the body's whole shape; a component inside itself stays a
// $ref.
const inlined = (
  schema: unknown,
  schemas: Record<string, unknown>,
  seen: string[] = []
): unknown => {
  if (Array.isArray(schema))
    return schema.map((item) => inlined(item, schemas, seen));
  if (typeof schema !== 'object' || schema === null) return schema;
  const { $ref, ...rest } = schema as { $ref?: string };
  const name = $ref?.replace('#/components/schemas/', '');
  if (name && name in schemas && !seen.includes(name))
    return {
      ...(inlined(schemas[name], schemas, [...seen, name]) as object),
      ...(inlined(rest, schemas, seen) as object)
    };
  return Object.fromEntries(
    Object.entries(schema).map(([key, value]) => [
      key,
      inlined(value, schemas, seen)
    ])
  );
};

// The servers that an operation names instead of the control plane's address,
// as the call of a Function names funcd's gateway.
const servers = (operation: OperationObject) =>
  (operation.servers ?? []).map((server) =>
    [
      `Server: \`${server.url}\`${server.description ? `, ${server.description}` : ''}`,
      ...Object.entries(server.variables ?? {}).map(
        ([name, variable]) => `\`{${name}}\`: ${variable.description ?? ''}`
      )
    ].join(' ')
  );

// The ways that the operation's own security takes: one of its requirements,
// an empty one meaning none, each with its schemes' descriptions.
const authentication = (
  operation: OperationObject,
  schemes: Record<string, { description?: string }>
) => {
  const ways = (operation.security ?? []).map((requirement) => {
    const names = Object.keys(requirement);
    if (names.length === 0) return '- none';
    const described = names
      .map((name) => schemes[name]?.description)
      .filter(Boolean);
    return `- ${names.map((name) => `\`${name}\``).join(' and ')}${
      described.length > 0 ? `: ${described.join(' ')}` : ''
    }`;
  });
  if (ways.length === 0) return ['## Authentication', 'None.'];
  return [
    '## Authentication',
    ways.length > 1 ? `One of:\n\n${ways.join('\n')}` : ways[0]
  ];
};

const locations = ['path', 'query', 'header', 'cookie'];

const parameters = (operation: OperationObject) => {
  const list = [...((operation.parameters ?? []) as ParameterObject[])].sort(
    (a, b) => locations.indexOf(a.in ?? '') - locations.indexOf(b.in ?? '')
  );
  if (list.length === 0) return [];
  return [
    '## Parameters',
    [
      '| Parameter | In | Type | Description |',
      '| --- | --- | --- | --- |',
      ...list.map(({ name, in: at, required, schema, description }) => {
        const type = [(schema as { type?: string | string[] })?.type]
          .flat()
          .filter(Boolean)
          .join(' or ');
        const kind = [type, required && 'required'].filter(Boolean).join(', ');
        return `| \`${name}\` | ${at} | ${cell(kind)} | ${cell(description)} |`;
      })
    ].join('\n')
  ];
};

const body = (operation: OperationObject, schemas: Record<string, unknown>) => {
  const requestBody = operation.requestBody as RequestBodyObject | undefined;
  if (!requestBody) return [];
  return [
    '## Body',
    requestBody.description,
    ...(
      Object.entries(requestBody.content ?? {}) as [
        string,
        { schema?: unknown }
      ][]
    ).map(([type, { schema }]) => {
      const name = (schema as { $ref?: string })?.$ref?.split('/').pop();
      const head = `${name ? `\`${name}\` as ` : ''}\`${type}\`${
        requestBody.required ? ', required' : ''
      }.`;
      return schema === undefined
        ? head
        : `${head}\n\n\`\`\`json\n${JSON.stringify(inlined(schema, schemas), null, 2)}\n\`\`\``;
    })
  ];
};

// A page of the API reference as an agent reads it, written from the spec
// (funcd ADR-0331), since fumadocs-openapi's own copy is the whole spec as
// JSON: the method and path, the summary, the authentication of the
// operation's own security, the parameters, the body's schema and the Answers
// rows.
const referenceMarkdown = (page: { url: string; data: OpenAPIPageData }) => {
  const { path, method, operation } = operationOf(page.data);
  const { components } = page.data.getSchema().bundled;
  const schemes = (components?.securitySchemes ?? {}) as Record<
    string,
    { description?: string }
  >;
  const schemas = (components?.schemas ?? {}) as Record<string, unknown>;
  return [
    `# ${page.data.title}`,
    `URL: ${base}${page.url}`,
    operation.description,
    `\`${method.toUpperCase()} ${path}\``,
    ...servers(operation),
    ...authentication(operation, schemes),
    ...parameters(operation),
    ...body(operation, schemas),
    '## Answers',
    [
      '| Status | Problem type | When | What to do |',
      '| --- | --- | --- | --- |',
      ...answersOf(operation).map(
        ({ status, problem, when, fix }) =>
          `| ${status} | ${problem && `\`${problem}\``} | ${cell(when)} | ${cell(fix)} |`
      )
    ].join('\n')
  ]
    .filter(Boolean)
    .join('\n\n');
};

// llms.txt lists every page, the Spec tabs included: it reads the tree before the sidebar folds each feature.
export const docsLlms = llms(loader(options), {
  renderUrl: (node) => markdownUrl(node.url),
  renderPage: async (page) =>
    page.type === 'openapi'
      ? referenceMarkdown(page)
      : [
          `# ${page.data.title}`,
          `URL: ${base}${page.url}`,
          page.data.description ?? '',
          absoluteLinks(await page.data.getText('processed'), page.path)
        ]
          .filter(Boolean)
          .join('\n\n')
});
