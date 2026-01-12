// @ts-check
import { defineConfig } from 'astro/config';
import { dbUxAstro } from '@db-ux/astro';
import { navigation } from './src/app.navigation';

// https://astro.build/config
export default defineConfig({
  integrations: [
    dbUxAstro({
      appName: '@db-ux/astro',
      navigation,
    }),
  ],
  site: 'https://design-system.deutschebahn.com',
  base: '/astro/',
  devToolbar: {
    enabled: false,
  },
});
