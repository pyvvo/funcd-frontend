import { mergeConfig } from 'vite-plus';
import { defineConfig } from 'vite-plus';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['node_modules', 'dist'],
      setupFiles: 'setup-tests.ts',
      coverage: {
        reporter: ['text', 'html'],
        exclude: ['node_modules', 'setup-tests.ts']
      }
    }
  })
);
