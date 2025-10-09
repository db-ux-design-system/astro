// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	// JavaScript
	{
		files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
		plugins: { js },
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			'no-console': 'error',
		},
	},
	// TypeScript
	...tseslint.configs.recommended,
	{
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},
	// Excludes
	globalIgnores([
		'**/dist/**',
		'**/node_modules/**',
		'**/reports/**',
		'**/.astro/**',
	]),
]);
