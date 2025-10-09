## Usage

Start by setting up a new Astro project.

```bash
npm create astro@latest
```

We recommend choosing `Use minimal (empty) template` during the installation questionnaire. This will allow you to use `@db-ux/astro` as we intended.

Next, install `@db-ux/astro` and its requirements.

```bash
npm i @db-ux/astro @db-ux/core-foundations @db-ux/core-components @db-ux/react-components @astrojs/mdx @astrojs/react react
```

Finally, navigate to to your `astro.config.mjs` file and add the `dbUxAstro` integration to your configuration.

```js
// @ts-check
import { defineConfig } from "astro/config";
import { dbUxAstro } from "@db-ux/astro";

// https://astro.build/config
export default defineConfig({
	integrations: [
		// Add the integration
		dbUxAstro({
			appName: "My awesome app",
		}),
	],
});
```

ℹ️ **Note:** `@db-ux/astro` bundles the following integrations (and their dependencies), so you do not need to install them yourself:

- [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/)
- [`@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/)
