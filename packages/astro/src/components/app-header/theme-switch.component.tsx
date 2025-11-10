import { DBSwitch } from '@db-ux/react-core-components';
import { LocalStorage } from '../../services/local-storage.service.ts';
import { useEffect, useState, type ReactElement } from 'react';
import { BuiltinIntl } from '../../services/intl.service.ts';

export function ThemeSwitch(): ReactElement {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    LocalStorage.get('theme')
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', colorScheme);
    document.body.setAttribute('data-mode', colorScheme);

    LocalStorage.set('theme', colorScheme);
  }, [colorScheme]);

  const handleChange = () => {
    const newValue = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newValue);
  };

  return (
    <DBSwitch
      className="firefly-theme-switch"
      checked={colorScheme === 'dark'}
      // iconLeading="circle"
      // iconTrailing="circle"
      // visualAid={true}
      title={BuiltinIntl.translate('theme-switch.title')}
      label={BuiltinIntl.translate('theme-switch.label')}
      onChange={handleChange}
    />
  );
}
