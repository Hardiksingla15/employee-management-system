import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During development the browser calls this Vite server (port 5173).
// Vite forwards every /api request to the Spring Boot app on port 8080.
// That keeps the browser on one origin, so the backend does not need CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
