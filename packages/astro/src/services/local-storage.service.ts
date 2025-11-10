import { LocalStorageMixin } from '@spuxx/browser-utils';
import { getDbUxAstroConfig } from '../config';

export interface ILocalStorage {
  theme: 'light' | 'dark';
}
export class LocalStorage extends LocalStorageMixin<ILocalStorage>({
  key: getDbUxAstroConfig().appName.toLocaleLowerCase().replaceAll(' ', '-'),
  defaultValues: {
    theme: () => {
      try {
        return window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return 'light';
      }
    },
  },
}) {}
