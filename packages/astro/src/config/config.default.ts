import type { DbUxAstroConfig } from './config.types';

export const defaultConfig: DbUxAstroConfig & {
  appName: string;
  sitemapBlacklist: string[];
} = {
  appName: '@db-ux/astro',
  sitemapBlacklist: [],
};
