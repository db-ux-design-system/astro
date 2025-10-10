import type { AstroIntegration } from 'astro';
import type { DbUxAstroConfig } from './types';
// import react from '@astrojs/react';
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
      'astro:config:setup': ({ config: astroConfig }) => {
        // Store the config globally during setup
        globalConfig = config;

        // Add bundled integrations
        const integrations: AstroIntegration[] = astroConfig.integrations;
        // integrations.push(react());
        integrations.push(mdx());
      },
    },
  };
}

export * from './types';
