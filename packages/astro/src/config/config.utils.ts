import type { CombinedConfig } from './config.types';

/**
 * Returns the package's configuration object. Works both client-side and server-side.
 * @returns The configuration object.
 */
export function getDbUxAstroConfig(): CombinedConfig {
  // @ts-expect-error - This is defined in the vite.define step in the integration setup
  const config: CombinedConfig = import.meta.env.DB_UX_ASTRO_CONFIG;
  return config;
}
