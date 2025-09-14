import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    !process.env.VITEST && reactRouter(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'app/setup-tests.ts',
    include: ['app/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.react-router/**',
      'eslint.config.js',
      'vite.config.ts',
      'rest-client-app/.react-router/**',
      '**/+types/**',
      '**/+server-build.d.ts',
      'react-router.config.ts',
    ],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules',
        'dist',
        '.react-router/**',
        '**/+types/**',
        '**/+server-build.d.ts',
        'eslint.config.js',
        'vite.config.ts',
        'rest-client-app/root.tsx',
        'rest-client-app/routes.ts',
        'rest-client-app/routes-path.ts',
        'react-router.config.ts',
      ],
    },
  },
});
