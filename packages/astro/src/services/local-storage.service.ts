import { LocalStorageMixin } from '@spuxx/browser-utils';

export interface ILocalStorage {
  theme: 'light' | 'dark';
}
export class LocalStorage extends LocalStorageMixin<ILocalStorage>({
  key: import.meta.env.DB_UX_ASTRO_CONFIG.appName
    .toLocaleLowerCase()
    .replaceAll(' ', '-'),
  defaultValues: {
    theme:
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
  },
}) {}
