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
        title: 'Navigation',
        path: '/guides/navigation',
      },
    ],
  },
  {
    title: 'Layouts',
    children: [
      {
        title: 'Default',
        path: '/layouts/default',
      },
    ],
  },
  {
    title: 'Components',
    children: [],
  },
];
