import type { AstroIntegrationLogger } from 'astro';
import { type CombinedConfig } from '../config';

/**
 * Filters out pages that are blacklisted from the sitemap.
 * @param page The page to check.
 * @param config The combined configuration.
 * @param logger The logger.
 * @returns Whether the page should be included in the sitemap.
 */
export function filterSitemapBlacklist(
  page: string,
  config: CombinedConfig,
  logger: AstroIntegrationLogger
): boolean {
  for (const blacklistedPage of config.sitemapBlacklist ?? []) {
    let fullBlacklistedPage = `${config.site}${config.base}${blacklistedPage}`;
    // Make sure that trailing slashes match
    if (page.endsWith('/') && !fullBlacklistedPage.endsWith('/')) {
      fullBlacklistedPage = fullBlacklistedPage + '/';
    } else if (fullBlacklistedPage.endsWith('/') && !page.endsWith('/')) {
      page = page + '/';
    }
    if (fullBlacklistedPage === page) {
      logger.info(
        `Page \x1b[36m${page}\x1b[0m is blacklisted and will not be included into the sitemap.`
      );
      return false;
    }
  }
  return true;
}
