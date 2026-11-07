import { defineConfig } from 'vite-plus';

export default defineConfig({
  base: './',
  server: { host: '127.0.0.1', port: 5178, strictPort: true }
});
