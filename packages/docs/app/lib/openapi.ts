import { update } from 'fumadocs-core/source';
import type {
  OperationItem,
  OperationObject,
  WebhookItem
} from 'fumadocs-openapi';
import { createOpenAPI, type OpenAPIPageData } from 'fumadocs-openapi/server';
import { readFileSync } from 'node:fs';
import { basename, dirname } from 'node:path';

// funcd's control plane spec and the paths of its reference's pages, which
// scripts/sync-content.ts mirrors beside the guide.
const spec = './content/funcd/api/openapi/funcd.v1alpha1.yaml';
const referencePaths = './content/funcd/api/openapi/reference-paths.json';

// The pages leave the spec out of their props: the build reads it from disk,
// and a browser fetches /openapi.json once (funcd ADR-0331).
export const openapi = createOpenAPI({ input: [spec], includeDocument: false });

export const bundledSpec = async () => (await openapi.getSchema(spec)).bundled;

// The API reference's pages, one per entry of funcd's reference-paths.json, at
// /docs/api/<path>. funcd's kindref places and names them, and the meta.json
// files it writes under docs/guide/api title and order their folders, so the
// site writes no rule of its own; an operation without an entry gets no page.
export async function apiSource() {
  const paths: Record<string, string> = JSON.parse(
    readFileSync(referencePaths, 'utf8')
  );
  const document = await bundledSpec();
  const pathOf = ({ item }: { item: OperationItem | WebhookItem }) =>
    'path' in item
      ? paths[document.paths?.[item.path]?.[item.method]?.operationId ?? '']
      : undefined;
  const source = await openapi.staticSource({
    baseDir: 'api',
    groupBy: (entry) => dirname(pathOf(entry) ?? ''),
    name: (output: { item: OperationItem | WebhookItem }) =>
      basename(pathOf(output) ?? '')
  });
  return update(source)
    .files((files) =>
      files.filter(
        (file) =>
          file.type !== 'page' ||
          file.data
            .getOpenAPIPageProps()
            .operations?.some((item) => pathOf({ item }))
      )
    )
    .build();
}

// The operation that a page of the API reference shows.
export const operationOf = (data: OpenAPIPageData) => {
  const [{ path, method }] = data.getOpenAPIPageProps().operations ?? [];
  const operation = data.getSchema().bundled.paths?.[path]?.[method];
  if (!operation) throw new Error(`the spec has no ${method} ${path}`);
  return { path, method, operation };
};

// A status's cases, as funcd's x-funcd-cases lists them (funcd ADR-0329): a
// problem's type, or the schema of a body that is no problem.
type Case = { type?: string; body?: string; when: string; fix: string };
type Response = { description?: string; 'x-funcd-cases'?: Case[] };

const responsesOf = (operation: OperationObject) =>
  Object.entries(operation.responses ?? {}) as [string, Response][];

export const casesOf = (operation: OperationObject) =>
  responsesOf(operation).flatMap(
    ([, response]) => response['x-funcd-cases'] ?? []
  );

export type Answer = {
  status: string;
  problem: string;
  when: string;
  fix: string;
};

// The rows of an operation's Answers table, on its page and in its Markdown
// copy (funcd ADR-0331): one per case, a case whose body is another schema
// named by that schema, and one per status with no case.
export const answersOf = (operation: OperationObject): Answer[] =>
  responsesOf(operation).flatMap(([status, response]) => {
    const cases = response['x-funcd-cases'] ?? [];
    if (cases.length === 0)
      return [
        { status, problem: '', when: response.description ?? '', fix: '' }
      ];
    return cases.map(({ type, body, when, fix }) => ({
      status,
      problem: type ?? body ?? '',
      when,
      fix
    }));
  });
