import type { AstroIntegration } from 'astro';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import type { DbUxAstroConfig, CombinedConfig } from './config/config.types';

const defaultConfig: DbUxAstroConfig = {
  appName: '@db-ux/astro',
};

let globalConfig: DbUxAstroConfig = {
  ...defaultConfig,
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
        // Store the config globally during setup
        globalConfig = config;
        const combinedConfig: CombinedConfig = {
          ...globalConfig,
          base: astroConfig.base || '/',
          site: astroConfig.site,
        };

        // Add bundled integrations
        const integrations: AstroIntegration[] = astroConfig.integrations;
        integrations.push(react());
        integrations.push(mdx());

        // Make config also available client-side through vite.define
        updateConfig({
          vite: {
            define: {
              'import.meta.env.DB_UX_ASTRO_CONFIG': combinedConfig,
            },
          },
        });
      },
    },
  };
}

export * from './config/index';
