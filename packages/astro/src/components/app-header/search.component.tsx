import {
  DBButton,
  DBCard,
  DBDrawer,
  DBInput,
  DBTooltip,
} from '@db-ux/react-core-components';
import React, { type ReactElement, useEffect, useState } from 'react';
import {
  type AnyOrama,
  create,
  load,
  type RawData,
  type Results,
  search,
} from '@orama/orama';
import { BuiltinIntl } from '../../services/intl.service';
import { useDebounce } from '../../hooks/use-debounce.hook';
import { getMarkedContent } from '../../utils/search.utils';
import { getDbUxAstroConfig } from '../../config';

type PageSchema = {
  path: string;
  title: string;
  h1: string;
  content: string;
};

/**
 * Search button which triggers a drawer with a search input.
 * The search input will search through the pages content and display the results.
 * The results are a sort summary of the content with the search term highlighted.
 */
export function Search(): ReactElement {
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [pagesDb, setPagesDb] = useState<AnyOrama>();
  const [searchResults, setSearchResults] = useState<Results<PageSchema>>();
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    const run = async () => {
      const db = create({ schema: { _: 'string' } });

      const dbResponse = await fetch(
        `${getDbUxAstroConfig().base}assets/oramaDB_pages.json`
      );
      if (dbResponse.ok) {
        const dbData = (await dbResponse.json()) as RawData;

        load(db, dbData);

        setPagesDb(db);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (pagesDb && debouncedQuery) {
      const results: Results<PageSchema> | Promise<Results<PageSchema>> =
        search(pagesDb, {
          term: debouncedQuery,
        });
      setSearchResults(results as Results<PageSchema>);
    }
  }, [debouncedQuery, pagesDb]);

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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(event.target.value)
            }
          />
          {(searchResults?.hits?.length || 0) > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            searchResults?.hits.map((hit: any) => {
              const content = hit.document.content.replace(hit.document.h1, '');
              const { start, termIndex, end } = getMarkedContent(
                content,
                query
              );
              return (
                <a
                  key={hit.document.path}
                  href={`${getDbUxAstroConfig().base}${hit.document.path.replace('/', '')}`}
                >
                  <DBCard>
                    <span className="bold">{hit.document.h1}</span>
                    <small>
                      {content.substring(start, termIndex)}
                      <mark>
                        {content.substring(termIndex, termIndex + query.length)}
                      </mark>
                      {content.substring(termIndex + query.length, end)}
                    </small>
                  </DBCard>
                </a>
              );
            })
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
