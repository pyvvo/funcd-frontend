import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  base: '/funcd/',
  plugins: [fumadocsMdx(), tailwindcss(), reactRouter()],
  resolve: {
    alias: [
      {
        find: '@tabler/icons-react',
        replacement: '@tabler/icons-react/dist/esm/icons/index.mjs'
      },
      // The logos are plain SVG components. Taken from the source, they render
      // in pre-rendered pages, which cannot load the @funcd-dev/ui bundle.
      {
        find: '@funcd-dev/ui/logo',
        replacement: fileURLToPath(
          new URL('../ui/src/atoms/logo/index.ts', import.meta.url)
        )
      },
      // The theme is read at build time only, for its palettes (lib/theme.server.ts).
      {
        find: '@funcd-dev/ui/theme',
        replacement: fileURLToPath(
          new URL('../ui/src/mantine.theme.ts', import.meta.url)
        )
      }
    ]
  }
});
