import type { AstroIntegration } from 'astro';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import orama from '@orama/plugin-astro';
import type { DbUxAstroConfig, CombinedConfig } from './config/config.types';
import { filterSitemapBlacklist } from './utils/sitemap.utils';

const defaultConfig: DbUxAstroConfig = {
  appName: '@db-ux/astro',
  sitemapBlacklist: ['/foo'],
};

/**
 * The `@db-ux/astro` integration for Astro projects.
 * @param config The config to provide to the integration.
 * @returns The integration.
 * @example
 * ```js
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config';
 * import { dbUxAstro } from '@db-ux/astro';
 * export default defineConfig({
 *   integrations: [dbUxAstro()],
 * });
 * ```
 */

export function dbUxAstro(config: DbUxAstroConfig): AstroIntegration {
  return {
    name: '@db-ux/astro',
    hooks: {
      'astro:config:setup': ({ config: astroConfig, updateConfig, logger }) => {
        logger.info('Setting up integration...');

        // Initialize config
        const combinedConfig: CombinedConfig = {
          ...defaultConfig,
          ...config,
          base: astroConfig.base || '/',
          site: astroConfig.site,
        };

        logger.info('Updating astro config...');
        updateConfig({
          build: {
            inlineStylesheets: 'always',
          },
          vite: {
            // Ensure the config is available client-side
            define: {
              'import.meta.env.DB_UX_ASTRO_CONFIG': combinedConfig,
            },
            resolve: {
              alias: {
                // Allow directory imports to resolve to index files
                '@db-ux/react-core-components':
                  '@db-ux/react-core-components/dist/index.js',
              },
            },
          },
          site: combinedConfig.site,
          base: combinedConfig.base,
        });

        // Add bundled integrations if needed
        logger.info('Adding bundled integrations...');
        const integrations: AstroIntegration[] = astroConfig.integrations;
        const allIntegrations = [...astroConfig.integrations];
        const bundledIntegrations = [
          react(),
          mdx(),
          orama({
            pages: {
              pathMatcher: new RegExp('.*'),
              language: 'english',
              contentSelectors: ['main'],
            },
          }),
          sitemap({
            filter: (page) =>
              filterSitemapBlacklist(page, combinedConfig, logger),
          }),
        ];
        for (const integration of bundledIntegrations) {
          if (!allIntegrations.find(({ name }) => name === integration.name)) {
            logger.info(
              `Adding integration: \x1b[36m${integration.name}\x1b[0m`
            );
            integrations.push(integration);
          } else {
            logger.info(
              `Skipping integration: \x1b[36m${integration.name}\x1b[0m`
            );
          }
        }
      },
      'astro:config:done': ({ logger }) => {
        logger.info('\x1b[32m✓ Setup complete.\x1b[0m');
      },
    },
  };
}

export * from './config/index';
