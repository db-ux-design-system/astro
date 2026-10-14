import {
  DBButton,
  DBCard,
  DBDrawer,
  DBInput,
  DBTooltip,
} from '@db-ux/react-core-components';
import React, { type ReactElement, useEffect, useRef, useState } from 'react';
import { BuiltinIntl } from '../../services/intl.service';
import { useDebounce } from '../../hooks/use-debounce.hook';
import { getDbUxAstroConfig } from '../../config';

/**
 * A single Pagefind search result after its data has been loaded.
 * `excerpt` is pre-escaped HTML containing `<mark>` tags around the matches,
 * so it is safe to render as `innerHTML`.
 */
type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: {
    title?: string;
  };
};

/**
 * Minimal typing of the parts of the Pagefind JS API that we use. The Pagefind
 * bundle is generated at build time and served as a static asset under
 * `<base>/pagefind/pagefind.js`, so it cannot be imported as a typed module.
 * @see https://pagefind.app/docs/api/
 */
type PagefindApi = {
  init: () => void;
  preload: (term: string) => void;
  debouncedSearch: (term: string) => Promise<{
    results: { data: () => Promise<PagefindResultData> }[];
  } | null>;
};

const MAX_RESULTS = 10;

/**
 * Joins the configured base path with a Pagefind result URL without
 * introducing a double slash (works for both `/` and `/sub-path/` bases).
 */
const withBase = (url: string): string =>
  `${getDbUxAstroConfig().base.replace(/\/$/, '')}${url}`;

/**
 * Search button which triggers a drawer with a search input.
 * The search input queries the Pagefind index that is generated at build time
 * and displays the matching pages with a highlighted excerpt.
 */
export function Search(): ReactElement {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<PagefindResultData[]>([]);
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 200);
  const pagefindRef = useRef<PagefindApi | null>(null);

  // Lazily load the Pagefind bundle the first time the drawer is opened.
  useEffect(() => {
    if (!searchOpen || pagefindRef.current) {
      return;
    }

    const loadPagefind = async () => {
      try {
        const bundlePath = `${getDbUxAstroConfig().base}pagefind/pagefind.js`;
        const pagefind = (await import(
          /* @vite-ignore */ bundlePath
        )) as PagefindApi;
        pagefind.init();
        pagefindRef.current = pagefind;
      } catch {
        // The Pagefind bundle only exists in a production build (and is served
        // by astro-pagefind during `astro dev`). If it cannot be loaded, the
        // search simply yields no results instead of crashing.
        pagefindRef.current = null;
      }
    };

    void loadPagefind();
  }, [searchOpen]);

  useEffect(() => {
    const runSearch = async () => {
      const pagefind = pagefindRef.current;
      if (!pagefind || !debouncedQuery) {
        setSearchResults([]);
        return;
      }

      const result = await pagefind.debouncedSearch(debouncedQuery);
      if (!result) {
        // A more recent search superseded this one; keep the current results.
        return;
      }

      const loaded = await Promise.all(
        result.results.slice(0, MAX_RESULTS).map((hit) => hit.data())
      );
      setSearchResults(loaded);
    };

    void runSearch();
  }, [debouncedQuery]);

  return (
    <div className="dba-search">
      <DBButton
        icon="magnifying_glass"
        noText
        variant="ghost"
        onClick={() => setSearchOpen(true)}
      >
        {BuiltinIntl.translate('search.open')}
        <DBTooltip placement="left">
          {BuiltinIntl.translate('search.open')}
        </DBTooltip>
      </DBButton>
      <DBDrawer open={searchOpen} onClose={() => setSearchOpen(false)}>
        <div className="dba-search-result-container">
          <DBInput
            label={BuiltinIntl.translate('search.input-label')}
            placeholder={BuiltinIntl.translate('search.input-placeholder')}
            icon="magnifying_glass"
            variant="floating"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(event.target.value);
              pagefindRef.current?.preload(event.target.value);
            }}
          />
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <a key={result.url} href={withBase(result.url)}>
                <DBCard>
                  <span className="bold">{result.meta.title}</span>
                  <small dangerouslySetInnerHTML={{ __html: result.excerpt }} />
                </DBCard>
              </a>
            ))
          ) : (
            <p className="no-results">
              {BuiltinIntl.translate('search.no-results')}
            </p>
          )}
        </div>
      </DBDrawer>
    </div>
  );
}
