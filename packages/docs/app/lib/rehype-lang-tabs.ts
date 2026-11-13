import type { ElementContent, Root, RootContent } from 'hast';
import type { MdxJsxFlowElementHast } from 'mdast-util-mdx-jsx';

// The languages funcd ships a shim for, as a page's headings name them.
export const languages = ['TypeScript', 'Python'];

type Node = RootContent | ElementContent;

const rank = (node: Node) =>
  node.type === 'element' && /^h[1-6]$/.test(node.tagName)
    ? Number(node.tagName[1])
    : 0;

const text = (node: Node): string =>
  node.type === 'text'
    ? node.value
    : 'children' in node
      ? node.children.map((child) => text(child as Node)).join('')
      : '';

const languageOf = (node: Node) =>
  rank(node) > 0 ? languages.find((l) => text(node).trim() === l) : undefined;

const jsx = (
  name: string,
  attributes: MdxJsxFlowElementHast['attributes'],
  children: MdxJsxFlowElementHast['children']
): MdxJsxFlowElementHast => ({
  type: 'mdxJsxFlowElement',
  name,
  attributes,
  children
});

// One tab group from a run of language sections: each tab keeps its heading's
// id on an empty anchor, so a link to the old heading opens that tab.
const langTabs = (
  tabs: { language: string; id?: string; children: RootContent[] }[]
): MdxJsxFlowElementHast => {
  const items = tabs.map((t) => t.language);
  return jsx(
    'LangTabs',
    [
      {
        type: 'mdxJsxAttribute',
        name: 'items',
        value: {
          type: 'mdxJsxAttributeValueExpression',
          value: JSON.stringify(items),
          data: {
            estree: {
              type: 'Program',
              sourceType: 'module',
              comments: [],
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ArrayExpression',
                    elements: items.map((value) => ({ type: 'Literal', value }))
                  }
                }
              ]
            }
          }
        }
      }
    ],
    tabs.map(({ language, id, children }) =>
      jsx(
        'LangTab',
        [{ type: 'mdxJsxAttribute', name: 'value', value: language }],
        [
          ...(id
            ? [
                {
                  type: 'element' as const,
                  tagName: 'span',
                  properties: { id },
                  children: []
                }
              ]
            : []),
          ...(children as MdxJsxFlowElementHast['children'])
        ]
      )
    )
  );
};

// rehypeLangTabs turns each run of sibling sections headed by a language name
// (### TypeScript, ### Python; #### on a Spec page) into one tab group, so a
// reader picks a language once for the whole site. A section runs to the next
// heading of the same or a higher level. It works on the HTML tree, after the
// page's Markdown copy was taken, so that copy keeps the headings.
export function rehypeLangTabs() {
  return (tree: Root) => {
    const nodes = tree.children;
    const out: RootContent[] = [];
    let i = 0;
    while (i < nodes.length) {
      if (!languageOf(nodes[i])) {
        out.push(nodes[i]);
        i++;
        continue;
      }
      const depth = rank(nodes[i]);
      const tabs: Parameters<typeof langTabs>[0] = [];
      for (
        let language = languageOf(nodes[i]);
        language &&
        rank(nodes[i]) === depth &&
        !tabs.some((t) => t.language === language);
        language = i < nodes.length ? languageOf(nodes[i]) : undefined
      ) {
        const heading = nodes[i];
        const id =
          heading.type === 'element' ? heading.properties?.id : undefined;
        const children: RootContent[] = [];
        for (
          i++;
          i < nodes.length && !(rank(nodes[i]) > 0 && rank(nodes[i]) <= depth);
          i++
        ) {
          children.push(nodes[i]);
        }
        tabs.push({
          language,
          id: typeof id === 'string' ? id : undefined,
          children
        });
      }
      out.push(langTabs(tabs) as unknown as RootContent);
    }
    tree.children = out;
  };
}
