import type { NavigationItem } from 'src/types';

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
  /**
   * The navigation structure that will be used to construct the navigation
   * menu in the application header.
   * @see {@link NavigationItem}
   * @example
   * ```ts
   * const navigation: NavigationItem[] = [
   *   {
   *     title: 'Cats',
   *     path: '/cats',
   *   },
   *   {
   *     title: 'More on Cats',
   *     children: [
   *       {
   *         title: 'Cats are great',
   *         path: '/cats/cats-are-great',
   *       },
   *       {
   *         title: 'Why you should get a cat',
   *         path: '/cats/get-a-cat',
   *       }
   *     ]
   *   }
   * ];
   * ```
   */
  navigation?: NavigationItem[];
}

/**
 * An intersection of `DbUxAstroConfig` as well as selected Astro config options.
 */
export interface CombinedConfig extends DbUxAstroConfig {
  base: string;
  site?: string;
}
