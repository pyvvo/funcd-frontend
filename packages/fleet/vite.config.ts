import { defineConfig, loadEnv } from 'vite-plus';
import react from '@vitejs/plugin-react';

// The app always calls `/api` on its own origin. With API_URL set
// (`API_URL=http://localhost:8080 yarn dev:fleet`), the dev server forwards
// `/api` there and the mocks stay off; without it, MSW answers in the browser.
// In production, the server in front of the app forwards `/api`.
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const mockApi = env.VITE_MOCK_API ?? (env.API_URL ? 'false' : 'true');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_MOCK_API': JSON.stringify(mockApi)
    },
    server: env.API_URL
      ? { proxy: { '/api': { target: env.API_URL, changeOrigin: true } } }
      : undefined
  };
});
