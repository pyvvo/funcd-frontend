import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import { defineConfig } from 'vite-plus';
import * as pkg from './package.json';

import tailwindcss from '@tailwindcss/vite';
// import tsconfigPaths from 'vite-tsconfig-paths';
// import { visualizer } from 'rollup-plugin-visualizer';
// import { ViteAliases } from 'vite-aliases';

const peerDep = Object.keys(pkg.peerDependencies);

// Externalize peer deps *and* their subpaths (e.g. react/jsx-runtime,
// echarts/core). Matching only exact names lets subpath imports get bundled,
// which under Rolldown emits a runtime `require()` shim that throws in browsers.
// CSS from peer packages must stay bundled into ui.css, so exclude it.
const isExternal = (id: string) =>
  !id.endsWith('.css') &&
  peerDep.some((dep) => id === dep || id.startsWith(`${dep}/`));

// https://vitejs.dev/config//
// build for lib @see https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  // Declarations are emitted by `tsc -p tsconfig.build.json` (see the build
  // script), not by a Vite plugin: vite-plugin-dts / api-extractor need the
  // programmatic TypeScript compiler API, which TypeScript 7 removed.
  plugins: [
    react(),
    tailwindcss()
    // libInjectCss(),
    // tsconfigPaths(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      {
        find: '@tabler/icons-react',
        replacement: '@tabler/icons-react/dist/esm/icons/index.mjs'
      }
    ]
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'HMReactiveForm',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: isExternal,
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'JsxRuntime',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOMClient',
          '@mantine/core': 'Mantine',
          '@xyflow/react': 'XyFlowReact',
          // 'react/jsx-runtime': 'JsxRuntime',
          'react-hook-form': 'ReactHookForm',
          '@tabler/icons-react': 'TablerIcons',
          'react-router-dom': 'ReactRouterDom',
          dayjs: 'DayJS',
          '@mantine/hooks': 'MantineHooks',
          '@mantine/spotlight': 'MantineSpotlights',
          echarts: 'Echarts',
          'echarts/core': 'EchartsCore',
          'echarts/charts': 'EchartsCharts',
          'echarts/components': 'EchartsComponents',
          'echarts/features': 'EchartsFeatures',
          'echarts/renderers': 'EchartsRenderers'
        }
      }
      // plugins: [
      //   // @see https://github.com/doesdev/rollup-plugin-analyzer
      //   visualizer()
      // ]
    }
  }
});
