import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle
} from 'fumadocs-ui/layouts/docs/page';
import { use } from 'react';
import LatestRelease from '../components/latest-release';
import { pageLink, useMDXComponents } from '../components/mdx';
import { baseOptions } from '../lib/layout.shared';
import { docs, source } from '../lib/source';
import type { Route } from './+types/docs';

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params['*'].split('/').filter((v) => v.length > 0);
  const page = source.getPage(slugs);
  if (!page) throw new Response('Not found', { status: 404 });

  return {
    path: page.path,
    pageTree: await source.serializePageTree(source.getPageTree())
  };
}

const Content = ({ path }: { path: string }) => {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const Mdx = page.body;

  return (
    <DocsPage toc={toc}>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <div className="-mt-4 mb-4 border-b" />
      <DocsBody>
        <Mdx components={useMDXComponents({ a: pageLink(path) })} />
      </DocsBody>
    </DocsPage>
  );
};

export default function Page({ loaderData }: Route.ComponentProps) {
  const { pageTree, path } = useFumadocsLoader(loaderData);

  return (
    <DocsLayout
      {...baseOptions()}
      tree={pageTree}
      sidebar={{ banner: <LatestRelease /> }}>
      <Content path={path} />
    </DocsLayout>
  );
}
