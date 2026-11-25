import { docsLlms } from '../lib/source';

// The site's address.
const origin = 'https://funcd.dev';

// llmstxt.org asks for the project's name as the H1 and a blockquote that sums it up; fumadocs titles the index "Docs".
const header = [
  '# funcd',
  '',
  '> funcd is a lightweight, single-binary serverless platform for Linux, driven by funcdctl. These docs describe its',
  "> latest release. Each link is the Markdown copy of a page; a kind's fields are on its Spec tab, the page's spec.md."
].join('\n');

// The site's llms.txt (llmstxt.org): every page, linked to its markdown copy by an absolute URL, so that an agent
// that reads the file outside the site can follow each link.
export async function loader() {
  const index = docsLlms
    .index()
    .replace(/^# .*\n/, `${header}\n`)
    // llmstxt.org sections are H2s; fumadocs writes each root folder as a bold list item.
    .replace(/^- \*\*(.+)\*\*$/gm, '## $1')
    .replace(/\]\((\/[^)\s]+)\)/g, (_, path: string) => `](${origin}${path})`);
  return new Response(index, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
