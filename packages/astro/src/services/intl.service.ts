import { Intl } from '@spuxx/js-utils';
import { de, en } from '../dictionaries';

export class BuiltinIntl extends Intl {
  private static _builtinInstance: BuiltinIntl | null;

  public static get instance(): BuiltinIntl {
    if (!BuiltinIntl._builtinInstance) {
      BuiltinIntl._builtinInstance = new BuiltinIntl();
    }
    return BuiltinIntl._builtinInstance;
  }

  static setup() {
    const options = {
      dictionaries: [
        { locale: 'de', values: de },
        { locale: 'en', values: en },
      ],
      fallbackLocale: 'de',
    };
    super.setup(options);
  }
}

export const intl = BuiltinIntl.translate.bind(BuiltinIntl);
