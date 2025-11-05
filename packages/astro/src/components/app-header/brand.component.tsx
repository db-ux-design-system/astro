import type { ReactElement } from 'react';

export function Brand(): ReactElement {
  const { appName, basePath } = import.meta.env.DB_UX_ASTRO_CONFIG;

  return (
    <a className="db-brand" data-icon="db" href={basePath} title="Home">
      {appName}
    </a>
  );
}
