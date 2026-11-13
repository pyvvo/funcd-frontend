// A relative link names a page's file, as on GitHub (`get-started/install.md`):
// it becomes that page's URL (`/docs/get-started/install`). Another link, an
// absolute path or an anchor stays as it is.
export const pageHref = (href: string, pagePath: string) => {
  if (/^[a-z][a-z+.-]*:|^[/#]/i.test(href)) return href;
  const [file, hash] = href.split('#');
  const { pathname } = new URL(file, `file:///${pagePath}`);
  const slug = pathname
    .slice(1)
    .replace(/\.mdx?$/, '')
    .replace(/(^|\/)index$/, '');
  return `/docs${slug ? `/${slug}` : ''}${hash ? `#${hash}` : ''}`;
};
