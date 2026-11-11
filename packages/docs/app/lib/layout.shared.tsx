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
