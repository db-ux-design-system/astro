import type { ReactElement } from 'react';
import {
  DBIcon,
  DBNavigation,
  DBNavigationItem,
} from '@db-ux/react-core-components';
import { getDbUxAstroConfig } from '../../config';
import { getAriaCurrent } from '../../utils/client.utils';

function href(path?: string): string {
  const { base } = getDbUxAstroConfig();
  return `${base.replace(/\/+$/, '')}/${(path ?? '').replace(/^\/+/, '')}`;
}

export function Navigation(): ReactElement | null {
  const { navigation } = getDbUxAstroConfig();
  if (!navigation || navigation.length === 0) return null;

  return (
    <DBNavigation>
      {navigation.map((item) => (
        <DBNavigationItem
          key={item.title}
          subNavigation={
            item.children
              ? item.children.map((child) => (
                  <DBNavigationItem key={child.title}>
                    <a
                      href={href(child.path)}
                      aria-current={getAriaCurrent(child.path)}
                    >
                      {child.icon && <DBIcon icon={child.icon} />}
                      {child.title}
                    </a>
                  </DBNavigationItem>
                ))
              : undefined
          }
        >
          {item.children ? (
            <>
              {item.icon && <DBIcon icon={item.icon} />}
              {item.title}
            </>
          ) : (
            <a href={href(item.path)} aria-current={getAriaCurrent(item.path)}>
              {item.icon && <DBIcon icon={item.icon} />}
              {item.title}
            </a>
          )}
        </DBNavigationItem>
      ))}
    </DBNavigation>
  );
}
