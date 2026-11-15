import { bundledSpec } from '../lib/openapi';

// The spec, once for the whole site: each page of the API reference loads it
// in the browser (funcd ADR-0331).
export async function loader() {
  return Response.json(await bundledSpec());
}
