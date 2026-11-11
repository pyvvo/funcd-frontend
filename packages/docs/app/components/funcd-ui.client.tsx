import '@mantine/core/styles.layer.css';
import '@funcd-dev/ui/dist/ui.css';
import { cssVarResolver, pyTheme } from '@funcd-dev/ui';
import { MantineProvider } from '@mantine/core';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';

export { ReactiveBarChart, StatCard } from '@funcd-dev/ui';
export { Button, Group, SimpleGrid } from '@mantine/core';

// Mantine follows the color scheme that Fumadocs' theme switch sets.
export const FuncdUiProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();

  return (
    <MantineProvider
      theme={{ ...pyTheme }}
      cssVariablesResolver={cssVarResolver}
      forceColorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}>
      {children}
    </MantineProvider>
  );
};
