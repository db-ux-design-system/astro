import type { ReactElement } from 'react';
import { getDbUxAstroConfig } from '../../config';

export function Brand(): ReactElement {
  const { appName, base } = getDbUxAstroConfig();

  return (
    <a className="db-brand" data-icon="db" href={base} title="Home">
      {appName}
    </a>
  );
}
