import { type CombinedConfig } from '../config';

/**
 * Filters out pages that are blacklisted from the sitemap.
 * @param page The page to check.
 * @returns Whether the page should be included in the sitemap.
 */
export function filterSitemapBlacklist(
  page: string,
  config: CombinedConfig
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
      // eslint-disable-next-line no-console
      console.log(
        `${page} is blacklisted and will not be included into the sitemap.`
      );
      return false;
    }
  }
  return true;
}
