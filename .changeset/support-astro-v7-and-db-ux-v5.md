---
'@db-ux/astro': minor
---

Add support for Astro v7 and DB UX Design System v5

This is a breaking change (shipped as a minor bump while the package is still
pre-1.0): projects must upgrade to Astro 7 and `@db-ux/*` v5, and the bundled
Orama search is replaced.

- Raise peer dependencies to Astro `^7`, `@astrojs/react ^7`, `@db-ux/core-*`
  `^5` and `@db-ux/db-theme-icons ^4`.
- Update the bundled integrations for Astro 7: `@astrojs/mdx` `7.0.8` (the
  previous `5.x` imported the removed `astro/jsx/rehype.js` subpath) and
  `@astrojs/sitemap` `3.7.4`.
- **Breaking:** replace the unmaintained `@orama/plugin-astro` (which crashed on
  Astro 7's changed `astro:build:done` hook) with `astro-pagefind`. Search now
  also works in `astro dev`, and the existing DB UX search drawer is driven
  through the Pagefind JS API. Page content is scoped for indexing via
  `data-pagefind-body`. Consumers relying on the previous Orama search index
  (`oramaDB_pages.json`) or the `@orama/orama` client API must migrate.
- Fix the `@db-ux/core-foundations` theme stylesheet import path, which moved to
  `build/styles/theme/rollup.css` in v5.
