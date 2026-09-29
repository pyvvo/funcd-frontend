import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';
// @ts-ignore
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()]
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: env.VITE_API_BASE_URL, // https://dev.to/ghacosta/til-setting-up-proxy-server-on-vite-2cng
  //       changeOrigin: true,
  //       secure: false,
  //       agent: new http.Agent()
  //     }
  //   }
  // }
});
