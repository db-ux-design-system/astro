import { useState, type ReactElement } from 'react';
import { Brand } from './brand.component';
// import { Navigation } from './navigation';
import { DBHeader } from '@db-ux/react-core-components';
import { ThemeSwitch } from './theme-switch.component';
// import { Search } from './search';

export function AppHeader(): ReactElement {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <DBHeader
      className="dba-header"
      drawerOpen={drawerOpen}
      onToggle={setDrawerOpen}
      brand={<Brand />}
      // primaryAction={<Search />}
      secondaryAction={<ThemeSwitch />}
    >
      {/* <Navigation /> */}
    </DBHeader>
  );
}
