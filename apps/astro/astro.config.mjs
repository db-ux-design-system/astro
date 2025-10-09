// @ts-check

import { defineConfig } from 'astro/config';
import { dbUxAstro } from '@db-ux/astro';

// https://astro.build/config
export default defineConfig({
	integrations: [
		dbUxAstro({
			appName: 'astro',
		}),
	],
});
