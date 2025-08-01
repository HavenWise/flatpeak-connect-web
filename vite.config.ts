import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/",
    plugins: [react()],
    define: {
      VITE_CONNECT_API_URL: `"${env.VITE_CONNECT_API_URL}"`
    },
    server: {
      port: 7070,
      host: true,
      historyApiFallback: true,
    },
    preview: {
      port: 7070,
      strictPort: true,
    }
  }
})
