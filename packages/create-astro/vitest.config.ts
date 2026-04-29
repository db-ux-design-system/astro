import { mergeConfig, defineConfig } from 'vitest/config';
import baseConfig from './vite.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      watch: false,
      include: ['src/**/*.test.ts'],
      silent: false,
      environment: 'node',
      setupFiles: ['tests/vitest.setup.ts'],
      coverage: {
        enabled: true,
        reporter: ['text'],
      },
    },
  })
);
