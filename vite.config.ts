import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tailwindcss(),
    // otherwise tests not working
    !process.env.VITEST && reactRouter(),
    tsconfigPaths(),

  ],
  server: {
    proxy: {
      '/proxy': {
        target: 'https://httpbin.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (!req.url) {
              res.statusCode = 400;
              res.end('URL is undefined');
              return;
            }

            const targetUrl = req.headers['x-target-url'] as string;

            if (!targetUrl) {
              res.statusCode = 400;
              res.end('X-Target-URL header is required');
              return;
            }

            try {
              const url = new URL(targetUrl);
              options.target = url.origin;
              proxyReq.path = url.pathname + url.search;
              proxyReq.setHeader('host', url.hostname);
            } catch (error) {
              res.statusCode = 400;
              res.end('Invalid URL');
            }
          });
        },
        secure: false
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './app/setup-tests.ts',
    include: ['app/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
});
