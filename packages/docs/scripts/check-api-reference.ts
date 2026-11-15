import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { staticClient } from 'fumadocs-core/search/client/orama-static';
import { createOpenAPI } from 'fumadocs-openapi/server';

// After the build, the API reference does what each scenario of the site in
// funcd ADR-0331 says, one named check each, read from the built pages, their
// Markdown copies and the search index. It expects a page for each entry of
// funcd's reference-paths.json, and the answers of the spec that the sync
// mirrors, a row per case and per status with no case. fumadocs-openapi reads
// that spec here, apart from app/lib/openapi.ts, so that a fault in the
// site's own loading cannot change the expected answers with the pages, and
// the spec check holds the cases it yields against the file's own lines.
const content = fileURLToPath(new URL('../content/funcd', import.meta.url));
const client = fileURLToPath(new URL('../build/client', import.meta.url));
const read = (path: string) => readFileSync(path, 'utf8');

type Case = { type?: string; body?: string; when: string; fix: string };
type Operation = {
  operationId?: string;
  summary?: string;
  security?: Record<string, string[]>[];
  parameters?: { name: string; in: string }[];
  requestBody?: {
    content?: Record<string, { schema?: { $ref?: string } }>;
  };
  responses?: Record<
    string,
    { description?: string; 'x-funcd-cases'?: Case[] }
  >;
};
type Spec = { paths: Record<string, Record<string, Operation>> };
type TreeNode = {
  type: string;
  name?: string;
  url?: string;
  root?: boolean | string;
  index?: TreeNode;
  children?: TreeNode[];
};

const paths: Record<string, string> = JSON.parse(
  read(join(content, 'api/openapi/reference-paths.json'))
);
const mirrored = join(content, 'api/openapi/funcd.v1alpha1.yaml');
const spec = (await createOpenAPI({ input: [mirrored] }).getSchema(mirrored))
  .bundled as unknown as Spec;
const served: Spec = JSON.parse(read(join(client, 'openapi.json')));
const operations = Object.entries(spec.paths).flatMap(([path, item]) =>
  Object.entries(item).flatMap(([method, operation]) => {
    const page = paths[operation.operationId ?? ''];
    return page ? [{ path, method, operation, url: `/docs/api/${page}` }] : [];
  })
);

const rowsOf = (operation: Operation) =>
  Object.entries(operation.responses ?? {}).flatMap(([status, response]) => {
    const cases = response['x-funcd-cases'] ?? [];
    if (cases.length === 0)
      return [[status, '', response.description ?? '', '']];
    return cases.map((c) => [status, c.type ?? c.body ?? '', c.when, c.fix]);
  });
const casesIn = (document: Spec, path: string, method: string) =>
  JSON.stringify(
    Object.entries(document.paths[path]?.[method]?.responses ?? {}).map(
      ([status, response]) => [status, response['x-funcd-cases'] ?? []]
    )
  );

const unescape = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');

const pageOf = (url: string) => read(join(client, url, 'index.html'));

// The page itself, without the sidebar, as a reader sees it with no script.
const articleOf = (html: string) =>
  html.slice(html.indexOf('<article id="nd-page"'), html.indexOf('</article>'));
const textOf = (html: string) =>
  unescape(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();

// The rows of the page's Answers table, cell by cell.
const answersOf = (html: string) => {
  const heading = html.indexOf('id="answers"');
  if (heading < 0) return undefined;
  const at = html.indexOf('<tbody', heading);
  const body = html.slice(at, html.indexOf('</tbody>', at));
  return [...body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map(([, row]) =>
    [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map(([, cell]) =>
      unescape(cell)
    )
  );
};

// React Router writes a page's loader data into its HTML as a turbo-stream: a
// list of values, where an object maps "_<index of a key>" to the index of its
// value, a list holds the indexes of its items, and -5 and -7 stand for null
// and undefined.
const loaderDataOf = (html: string) => {
  const stream = [
    ...html.matchAll(/streamController\.enqueue\(("(?:[^"\\]|\\.)*")\)/g)
  ]
    .map(([, chunk]) => JSON.parse(chunk) as string)
    .join('');
  const values: unknown[] = JSON.parse(stream.split('\n')[0]);
  const decode = (index: number): unknown => {
    if (index < 0) return index === -5 ? null : undefined;
    const value = values[index];
    if (Array.isArray(value)) return value.map(decode);
    if (typeof value !== 'object' || value === null) return value;
    return Object.fromEntries(
      Object.entries(value).map(([key, at]) => [
        values[Number(key.slice(1))],
        decode(at as number)
      ])
    );
  };
  const { loaderData } = decode(0) as {
    loaderData: Record<string, Record<string, any>>;
  };
  return loaderData['routes/docs'];
};
const treeOf = (html: string) =>
  loaderDataOf(html).pageTree.data as { children: TreeNode[] };
const nameOf = (node: TreeNode) => unescape(node.name ?? '').trim();
const urlsOf = (node: TreeNode): string[] => [
  ...(node.index?.url ? [node.index.url] : []),
  ...(node.children ?? []).flatMap((child) =>
    child.type === 'page' ? [child.url ?? ''] : urlsOf(child)
  )
];
const trailTo = (nodes: TreeNode[], url: string): string[] | undefined => {
  for (const node of nodes) {
    if (node.type === 'page' && node.url === url) return [nameOf(node)];
    const trail = trailTo(node.children ?? [], url);
    if (trail) return [nameOf(node), ...trail];
  }
};
const inReference = (url: string) =>
  url === '/docs/api' || url.startsWith('/docs/api/');

// The reference's titles, from the meta.json files that funcd writes.
const meta = (folder: string) =>
  JSON.parse(read(join(content, 'docs/guide/api', folder, 'meta.json'))) as {
    title: string;
    pages: string[];
  };
const reference = meta('');
const sections = reference.pages.filter((page) => page !== 'index');

const problems: string[] = [];
const passed: string[] = [];
const check = async (
  name: string,
  run: (fail: (problem: string) => void) => string | Promise<string>
) => {
  const before = problems.length;
  const detail = await run((problem) => problems.push(`${name}: ${problem}`));
  if (problems.length === before) passed.push(`${name}: ${detail}`);
};

// The pages read the spec with the same loader. Were it to drop the cases,
// both sides would lose them, and every check would pass on none. So the
// loader must yield some, as many as a count of the file's own lines: funcd
// writes each case as an item of x-funcd-cases whose when: holds its one-line
// text, and no other line starts with when: and a text.
await check('spec', (fail) => {
  const listed = read(mirrored).match(/^ *(- )?when: \S/gm)?.length ?? 0;
  const yielded = Object.values(spec.paths)
    .flatMap((item) => Object.values(item))
    .flatMap((operation) => Object.values(operation.responses ?? {}))
    .reduce(
      (sum, response) => sum + (response['x-funcd-cases']?.length ?? 0),
      0
    );
  if (yielded === 0 || yielded !== listed)
    fail(
      `fumadocs-openapi yields ${yielded} cases from content/funcd/api/openapi/funcd.v1alpha1.yaml, whose lines list ${listed}`
    );
  return `fumadocs-openapi yields ${yielded} cases from the mirrored spec, as many as its lines list`;
});

await check('reference-shows-an-operation', (fail) => {
  const built = readdirSync(join(client, 'docs/api'), {
    recursive: true,
    encoding: 'utf8'
  })
    .filter((file) => file.endsWith('index.html'))
    .map((file) => `/docs/api/${file}`.replace(/\/?index\.html$/, ''));
  const wanted = ['/docs/api', ...operations.map(({ url }) => url)];
  for (const url of wanted.filter((url) => !built.includes(url)))
    fail(`no page at ${url}`);
  for (const url of built.filter((url) => !wanted.includes(url)))
    fail(`${url} is the page of no entry of reference-paths.json`);
  for (const id of Object.keys(paths))
    if (!operations.some(({ operation }) => operation.operationId === id))
      fail(`reference-paths.json names ${id}, which the spec does not hold`);
  for (const { path, method, operation, url } of operations) {
    if (!built.includes(url)) continue;
    const html = articleOf(pageOf(url));
    const text = textOf(html);
    if (!text.replace(/\s/g, '').includes(`${method.toUpperCase()}${path}`))
      fail(`${url} shows no ${method.toUpperCase()} ${path}`);
    for (const { name, in: at } of operation.parameters ?? [])
      if (!html.includes(`id="parameters-${at}"`) || !text.includes(name))
        fail(`${url} shows no ${at} parameter ${name}`);
    if (operation.requestBody && !html.includes('id="request-body"'))
      fail(`${url} shows no body`);
    if (operation.security?.some((way) => Object.keys(way).length > 0))
      if (!html.includes('id="authorization"'))
        fail(`${url} shows no authentication`);
    const rows = answersOf(html) ?? [];
    const wantedRows = rowsOf(operation);
    const at = [...Array(Math.max(rows.length, wantedRows.length)).keys()].find(
      (i) => JSON.stringify(rows[i]) !== JSON.stringify(wantedRows[i])
    );
    const show = (row?: string[]) =>
      row?.join(' | ').replace(/\s+/g, ' ') ?? 'no row';
    if (at !== undefined)
      fail(
        `${url}'s Answers table shows ${show(rows[at])} at row ${at + 1}, not ${show(wantedRows[at])}`
      );
    if ('bundled' in (loaderDataOf(pageOf(url)).api.page.payload ?? {}))
      fail(`${url} holds the spec instead of loading /openapi.json`);
    if (casesIn(served, path, method) !== casesIn(spec, path, method))
      fail(`/openapi.json holds other cases than the spec for ${url}`);
  }
  return `${operations.length} pages show their method and path, parameters, body, authentication and Answers table`;
});

await check('function-call-in-reference', (fail) => {
  const call = operations.find(
    ({ operation }) => operation.operationId === 'invokeFunction'
  );
  if (!call || !existsSync(join(client, call.url, 'index.html'))) {
    fail('the reference has no page for invokeFunction');
    return '';
  }
  // The sidebar names a page of the reference with its method's badge.
  const [, section, kind] = call.url.split('/').slice(2);
  const wantedTrail = [
    reference.title,
    meta(section).title,
    meta(`${section}/${kind}`).title,
    `${call.operation.summary} ${call.method.toUpperCase()}`
  ];
  const trail = trailTo(treeOf(pageOf(call.url)).children, call.url);
  if (trail?.join(' › ') !== wantedTrail.join(' › '))
    fail(
      `the sidebar leads to ${call.url} through ${trail?.join(' › ')}, not ${wantedTrail.join(' › ')}`
    );
  const rows = answersOf(articleOf(pageOf(call.url))) ?? [];
  for (const wanted of rowsOf(call.operation))
    if (!rows.some((row) => JSON.stringify(row) === JSON.stringify(wanted)))
      fail(`${call.url}'s Answers table has no row ${wanted.join(' | ')}`);
  return `${wantedTrail.slice(1).join(' › ')} answers in ${rows.length} rows`;
});

// The site's search dialog runs this client on the index that the build
// exports, which it fetches; here the client reads the built file. A search
// finds a case when it returns the case's text on a page that answers it: a
// page found by other words of the text does not show the case.
await check('search-finds-a-case', async (fail) => {
  const index = readFileSync(join(client, 'api/search')).toString('base64');
  const { search } = staticClient({
    from: `data:application/json;base64,${index}`
  });
  const answering = new Map<string, Set<string>>();
  for (const { operation, url } of operations)
    for (const response of Object.values(operation.responses ?? {}))
      for (const { when } of response['x-funcd-cases'] ?? [])
        answering.set(when, (answering.get(when) ?? new Set()).add(url));
  for (const [when, pages] of answering) {
    const results = await search(when);
    const shown = results.filter(
      ({ type, url, content }) =>
        type !== 'page' &&
        pages.has(url.split('#')[0]) &&
        String(content).includes(when)
    );
    if (shown.length === 0)
      fail(
        `a search for "${when}" shows it on no page that answers it, but on ${[...new Set(results.map(({ url }) => url.split('#')[0]))].slice(0, 3).join(', ')}`
      );
  }
  return `a search for each of ${answering.size} case texts shows it on a page that answers it`;
});

await check('agent-reads-an-operation', (fail) => {
  const cell = (text: string) =>
    text.replace(/\s*\n\s*/g, ' ').replace(/\|/g, '\\|');
  for (const { path, method, operation, url } of operations) {
    const file = join(client, `${url}.md`);
    if (!existsSync(file)) {
      fail(`no Markdown copy at ${url}.md`);
      continue;
    }
    const copy = read(file);
    const holds = (part: string, what: string) => {
      if (!copy.includes(part)) fail(`${url}.md holds no ${what}`);
    };
    holds(`# ${operation.summary}\n`, 'summary');
    holds(`\`${method.toUpperCase()} ${path}\``, 'method and path');
    holds('## Authentication', 'authentication');
    for (const name of (operation.security ?? []).flatMap(Object.keys))
      holds(`\`${name}\``, `${name} authentication`);
    for (const { name, in: at } of operation.parameters ?? [])
      holds(`| \`${name}\` | ${at} |`, `${at} parameter ${name}`);
    for (const { schema } of Object.values(
      operation.requestBody?.content ?? {}
    )) {
      holds('## Body\n', 'body');
      holds('```json\n', "body's schema");
      const name = schema?.$ref?.split('/').pop();
      if (name) holds(`\`${name}\``, `body schema ${name}`);
    }
    for (const [status, problem, when, fix] of rowsOf(operation))
      holds(
        `| ${status} | ${problem && `\`${problem}\``} | ${cell(when)} | ${cell(fix)} |`,
        `Answers row ${status} ${problem} "${when}"`
      );
  }
  return `${operations.length} Markdown copies hold the method and path, summary, authentication, parameters, body and Answers rows`;
});

await check('reference-has-its-own-sidebar', (fail) => {
  for (const url of ['/docs/api', ...operations.map(({ url }) => url)]) {
    if (!existsSync(join(client, url, 'index.html'))) continue;
    const top = treeOf(pageOf(url)).children;
    const [guide, api] = top;
    if (
      top.length !== 2 ||
      !top.every((node) => node.type === 'folder' && node.root) ||
      nameOf(guide) !== 'Documentation' ||
      nameOf(api) !== reference.title
    ) {
      fail(
        `${url}'s page tree holds ${top.map(nameOf).join(', ')}, not the Documentation and ${reference.title} roots`
      );
      continue;
    }
    if (!urlsOf(api).includes(url)) fail(`${url} is not in ${reference.title}`);
    if (!urlsOf(api).every(inReference))
      fail(`${url}: ${reference.title} lists a page of the guide`);
    if (urlsOf(guide).some(inReference))
      fail(`${url}: Documentation lists a page of ${reference.title}`);
    if (urlsOf(guide)[0] !== '/docs')
      fail(`${url}: the switcher leads to ${urlsOf(guide)[0]}, not /docs`);
    const shown = (api.children ?? []).map((node) =>
      node.type === 'page' ? node.url : nameOf(node)
    );
    const wanted = ['/docs/api', ...sections.map((s) => meta(s).title)];
    if (shown.join(', ') !== wanted.join(', '))
      fail(
        `${url}: ${reference.title} lists ${shown.join(', ')}, not ${wanted.join(', ')}`
      );
  }
  return `${operations.length + 1} pages read the Documentation and ${reference.title} roots, and list ${sections.length} sections`;
});

// A broken spec makes thousands of lines, which process.exit() would cut where
// the output is a pipe, so the script sets its exit code and ends.
if (problems.length > 0) {
  console.error(
    `api-reference: ${problems.length} problem(s)\n${problems.join('\n')}`
  );
  process.exitCode = 1;
} else {
  console.log(passed.map((line) => `api-reference: ${line}`).join('\n'));
}
