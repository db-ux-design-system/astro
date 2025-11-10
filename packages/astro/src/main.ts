import type { AstroIntegration } from 'astro';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import orama from '@orama/plugin-astro';
import type { DbUxAstroConfig, CombinedConfig } from './config/config.types';
import { filterSitemapBlacklist } from './utils/sitemap.utils';

const defaultConfig: DbUxAstroConfig = {
  appName: '@db-ux/astro',
  sitemapBlacklist: [],
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
      'astro:config:setup': ({ config: astroConfig, updateConfig }) => {
        // Initialize config
        const combinedConfig: CombinedConfig = {
          ...defaultConfig,
          ...config,
          base: astroConfig.base || '/',
          site: astroConfig.site,
        };
        // Make config also available client-side through vite.define
        updateConfig({
          build: {
            inlineStylesheets: 'always',
          },
          vite: {
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
        });

        // Add bundled integrations
        const integrations: AstroIntegration[] = astroConfig.integrations;
        integrations.push(react());
        integrations.push(mdx());
        integrations.push(
          orama({
            pages: {
              pathMatcher: new RegExp('\/.+\/'),
              language: 'english',
            },
          })
        );
        integrations.push(
          sitemap({
            filter: (page) => filterSitemapBlacklist(page, combinedConfig),
          })
        );
      },
    },
  };
}

export * from './config/index';
