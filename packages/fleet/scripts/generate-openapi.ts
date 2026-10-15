import { writeFileSync } from 'node:fs';
import { z } from 'zod';
import { createDocument, ZodOpenApiPathsObject } from 'zod-openapi';
import { apiBase, ErrorSchema, IRoute, routes } from '../src/api/contract';

// Writes api/openapi.json from the contract: `yarn fleet gen:openapi`.
const paths: ZodOpenApiPathsObject = {};

for (const [operationId, route] of Object.entries(routes) as [
  string,
  IRoute
][]) {
  const path = `${apiBase}${route.path.replace(':id', '{id}')}`;
  paths[path] = {
    ...paths[path],
    [route.method]: {
      operationId,
      summary: route.summary,
      requestParams: {
        ...(route.path.includes(':id') && {
          path: z.object({ id: z.string() })
        }),
        ...(route.query && { query: route.query })
      },
      ...(route.body && {
        requestBody: {
          content: { 'application/json': { schema: route.body } }
        }
      }),
      responses: {
        '200': {
          description: 'OK',
          content: { 'application/json': { schema: route.response } }
        },
        '400': {
          description: 'The query or the body breaks the contract',
          content: { 'application/json': { schema: ErrorSchema } }
        },
        '404': {
          description: 'Not found',
          content: { 'application/json': { schema: ErrorSchema } }
        }
      }
    }
  };
}

const document = createDocument({
  openapi: '3.1.0',
  info: {
    title: 'Fleet API',
    version: '1.0.0',
    description:
      'The IoT fleet demo API. Generated from src/api/contract.ts; the app serves it with MSW.'
  },
  paths
});

writeFileSync(
  new URL('../api/openapi.json', import.meta.url),
  `${JSON.stringify(document, null, 2)}\n`
);
console.log(`api/openapi.json: ${Object.keys(paths).length} paths`);
