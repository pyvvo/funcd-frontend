import type { Node, Root } from 'fumadocs-core/page-tree';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle
} from 'fumadocs-ui/layouts/docs/page';
import { use } from 'react';
import { Link } from 'react-router';
import LatestRelease from '../components/latest-release';
import { pageLink, useMDXComponents } from '../components/mdx';
import { baseOptions } from '../lib/layout.shared';
import { docs, markdownUrl, source } from '../lib/source';
import type { Route } from './+types/docs';

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params['*'].split('/').filter((v) => v.length > 0);
  const page = source.getPage(slugs);
  if (!page) throw new Response('Not found', { status: 404 });

  const feature = featureOf(slugs);
  const [usage, spec] = feature?.tabs ?? [];
  const tree = source.getPageTree();
  return {
    path: page.path,
    url: page.url,
    feature,
    pageTree: await source.serializePageTree(
      spec?.active ? pointAt(tree, usage.url, spec.url) : tree
    )
  };
}

// On a Spec tab, the sidebar still marks the feature and keeps its section open: the feature's entry points at the
// open tab, since the sidebar shows a feature as one entry.
function pointAt(tree: Root, from: string, to: string): Root {
  const walk = (nodes: Node[]): Node[] =>
    nodes.map((node) => {
      if (node.type === 'page' && node.url === from)
        return { ...node, url: to };
      if (node.type === 'folder')
        return { ...node, children: walk(node.children) };
      return node;
    });
  return { ...tree, children: walk(tree.children) };
}

// A feature's Usage page (<feature>/index.md) and Spec page (<feature>/spec.md) show as two tabs under the feature's
// title and description, each tab at its own URL.
function featureOf(slugs: string[]) {
  const onSpec = slugs.at(-1) === 'spec';
  const at = onSpec ? slugs.slice(0, -1) : slugs;
  const usage = source.getPage(at);
  const spec = source.getPage([...at, 'spec']);
  if (!usage || !spec || !usage.path.endsWith('index.md')) return undefined;
  return {
    title: usage.data.title,
    description: usage.data.description,
    tabs: [
      { label: 'Usage', url: usage.url, active: !onSpec },
      { label: 'Spec', url: spec.url, active: onSpec }
    ]
  };
}

type Feature = NonNullable<ReturnType<typeof featureOf>>;

const Content = ({
  path,
  url,
  feature
}: {
  path: string;
  url: string;
  feature?: Feature;
}) => {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const tab = feature?.tabs.find((t) => t.active)?.label;
  const Mdx = page.body;

  return (
    <DocsPage toc={toc}>
      <title>{tab ? `${feature?.title} · ${tab}` : page.title}</title>
      <meta name="description" content={page.description} />
      <DocsTitle>{feature?.title ?? page.title}</DocsTitle>
      <DocsDescription>
        {feature?.description ?? page.description}
      </DocsDescription>
      <nav
        className="-mt-4 mb-4 flex items-end gap-5 border-b text-sm"
        aria-label="Page tabs">
        {feature?.tabs.map((t) => (
          <Link
            key={t.label}
            to={t.url}
            aria-current={t.active ? 'page' : undefined}
            className={`-mb-px border-b-2 pb-2 font-medium ${
              t.active
                ? 'border-fd-primary text-fd-foreground'
                : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground'
            }`}>
            {t.label}
          </Link>
        ))}
        <a
          href={markdownUrl(url)}
          className="ml-auto pb-2 text-fd-muted-foreground hover:text-fd-foreground">
          Markdown
        </a>
      </nav>
      <DocsBody>
        <Mdx components={useMDXComponents({ a: pageLink(path) })} />
      </DocsBody>
    </DocsPage>
  );
};

export default function Page({ loaderData }: Route.ComponentProps) {
  const { pageTree, path, url, feature } = useFumadocsLoader(loaderData);

  return (
    <DocsLayout
      {...baseOptions()}
      tree={pageTree}
      sidebar={{ banner: <LatestRelease /> }}>
      <Content path={path} url={url} feature={feature} />
    </DocsLayout>
  );
}
