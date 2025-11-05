import type { AstroIntegration } from 'astro';
import type { DbUxAstroConfig } from './types';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

const defaultConfig: DbUxAstroConfig = {
  appName: '@db-ux/astro',
};

let globalConfig: DbUxAstroConfig = {
  ...defaultConfig,
};

/**
 * Get the current `@db-ux/astro` configuration.
 * @returns The configuration object.
 */
export function getDbUxAstroConfig(): DbUxAstroConfig {
  return globalConfig;
}

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
        // Store the config globally during setup
        globalConfig = config;

        // Add bundled integrations
        const integrations: AstroIntegration[] = astroConfig.integrations;
        integrations.push(react());
        integrations.push(mdx());

        // Make config also available client-side through vite.define
        updateConfig({
          vite: {
            define: {
              'import.meta.env.DB_UX_ASTRO_CONFIG': JSON.stringify({
                ...globalConfig,
                basePath: astroConfig.base || '/',
                site: astroConfig.site,
              }),
            },
            resolve: {
              alias: {
                '@db-ux/db-theme-icons/build/fonts':
                  '/node_modules/@db-ux/db-theme-icons/build/fonts',
              },
            },
          },
        });
      },
    },
  };
}

export * from './types';
