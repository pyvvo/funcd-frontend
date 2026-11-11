import { FuncdLogo, FuncdWordmark } from '@funcd-dev/ui/logo';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export const baseOptions = (): BaseLayoutProps => ({
  nav: {
    title: (
      <>
        <FuncdLogo size={30} color="currentColor" aria-hidden />
        <FuncdWordmark width={88} color="currentColor" />
      </>
    )
  },
  githubUrl: 'https://github.com/pyvvo/funcd'
});

// The top bar of the home and "Not found" pages links to the docs; a docs page
// lists the pages in its sidebar instead.
export const homeOptions = (): BaseLayoutProps => ({
  ...baseOptions(),
  links: [{ text: 'Docs', url: '/docs', active: 'nested-url' }]
});
