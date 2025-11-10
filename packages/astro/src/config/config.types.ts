/**
 * The config to provide to the `@db-ux/astro` integration.
 */
export interface DbUxAstroConfig {
  /**
   * The name of the app.
   * @default '@db-ux/astro'
   */
  appName?: string;
  /**
   * A list of pages to exclude from the sitemap.
   * @default []
   */
  sitemapBlacklist?: string[];
}

/**
 * An intersection of `DbUxAstroConfig` as well as selected Astro config options.
 */
export interface CombinedConfig extends DbUxAstroConfig {
  base: string;
  site?: string;
}
