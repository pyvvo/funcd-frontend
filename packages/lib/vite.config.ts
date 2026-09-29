import { defineConfig } from 'vite-plus';
import * as path from 'node:path';
import * as pkg from './package.json';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import { visualizer } from 'rollup-plugin-visualizer';
// import { ViteAliases } from 'vite-aliases';

const peerDep = Object.keys(pkg.peerDependencies);

// Externalize peer deps *and* their subpaths (e.g. dayjs/plugin/utc).
// Matching only exact names lets subpath imports get bundled, which under
// Rolldown emits a runtime `require()` shim that throws in browsers.
const isExternal = (id: string) =>
  !id.endsWith('.css') &&
  peerDep.some((dep) => id === dep || id.startsWith(`${dep}/`));

// https://vitejs.dev/config//
// build for lib @see https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  // Declarations are emitted by `tsc -p tsconfig.build.json` (see the build
  // script), not by a Vite plugin: vite-plugin-dts / api-extractor need the
  // programmatic TypeScript compiler API, which TypeScript 7 removed.
  plugins: [],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'HMLib',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: isExternal,
      output: {
        globals: {
          dayjs: 'DayJS'
        }
      }
      // plugins: [
      //   // @see https://github.com/doesdev/rollup-plugin-analyzer
      //   visualizer()
      // ]
    }
  }
});
