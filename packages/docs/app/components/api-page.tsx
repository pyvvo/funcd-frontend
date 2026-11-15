import type { Document } from 'fumadocs-openapi';
import { createOpenAPIPage } from 'fumadocs-openapi/ui';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { ComponentProps } from 'react';
import type { Answer } from '../lib/openapi';

// The pages leave the spec out of their props (funcd ADR-0331): the build
// reads it from disk, and a browser fetches /openapi.json once per session.
let loading: Promise<Document> | undefined;
const loadDocument = () =>
  (loading ??= import.meta.env.SSR
    ? import('../lib/openapi').then(({ bundledSpec }) => bundledSpec())
    : fetch(`${import.meta.env.BASE_URL}openapi.json`).then((response) =>
        response.json()
      ));

// The public site has no funcd to call, so the page shows the operation's
// method and path where the playground would be.
const OpenAPIPage = createOpenAPIPage({
  loadDocument,
  playground: { enabled: false }
});

const { h2: Heading, table: Table } = defaultMdxComponents;

// A page of the API reference: the operation as fumadocs-openapi renders it,
// then every answer, one row per case and per status with no case. fumadocs
// shows a status's cases only after a click on it.
export const ApiPage = ({
  answers,
  ...props
}: ComponentProps<typeof OpenAPIPage> & { answers: Answer[] }) => (
  <>
    <OpenAPIPage {...props} />
    <Heading id="answers">Answers</Heading>
    <Table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Problem type</th>
          <th>When</th>
          <th>What to do</th>
        </tr>
      </thead>
      <tbody>
        {answers.map(({ status, problem, when, fix }, index) => (
          <tr key={index}>
            <td>{status}</td>
            <td>{problem && <code>{problem}</code>}</td>
            <td>{when}</td>
            <td>{fix}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </>
);
