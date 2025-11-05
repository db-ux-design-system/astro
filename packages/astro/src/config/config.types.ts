/**
 * The config to provide to the `@db-ux/astro` integration.
 */
export interface DbUxAstroConfig {
  appName: string;
}

/**
 * An intersection of `DbUxAstroConfig` as well as selected Astro config options.
 */
export interface CombinedConfig extends DbUxAstroConfig {
  base: string;
  site?: string;
}
