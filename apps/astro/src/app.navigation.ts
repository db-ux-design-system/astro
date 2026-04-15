import type { NavigationItem } from '@db-ux/astro';

export const navigation: NavigationItem[] = [
  {
    title: 'Guides',
    children: [
      {
        title: 'Getting Started',
        path: '/guides/getting-started',
      },
      {
        title: 'Configuration',
        path: '/guides/configuration',
      },
      {
        title: 'Navigation',
        path: '/guides/navigation',
      },
    ],
  },
  {
    title: 'Layouts',
    children: [
      {
        title: 'Default Layout',
        path: '/layouts/default',
      },
    ],
  },
  {
    title: 'Components',
    children: [],
  },
];
