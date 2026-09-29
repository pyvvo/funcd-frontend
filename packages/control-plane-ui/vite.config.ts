import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: '@tabler/icons-react',
        replacement: '@tabler/icons-react/dist/esm/icons/index.mjs'
      }
    ]
  }
});
