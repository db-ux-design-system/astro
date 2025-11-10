// @ts-check
import { defineConfig } from 'astro/config';
import { dbUxAstro } from '@db-ux/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    dbUxAstro({
      appName: '@db-ux/astro',
    }),
  ],
  site: 'https://design-system.deutschebahn.com/',
  base: '/astro/',
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    resolve: {
      alias: {
        // Allow directory imports to resolve to index files
        '@db-ux/react-core-components':
          '@db-ux/react-core-components/dist/index.js',
      },
    },
  },
});
