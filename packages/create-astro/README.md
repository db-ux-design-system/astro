# @db-ux/create-astro

CLI installer for `@db-ux/astro` that automatically installs all required peer dependencies.

## Usage

In your existing Astro project, run:

```bash
# Using pnpm
pnpm create db-ux-astro

# Using npm
npm create db-ux-astro

# Using yarn
yarn create db-ux-astro
```

This will automatically install:

- `@db-ux/astro`
- `@astrojs/react`
- `@db-ux/core-components`
- `@db-ux/core-foundations`
- `@db-ux/db-theme-icons`
- `@db-ux/react-core-components`
- `react`
- `react-dom`

## Features

- ✅ Automatically detects your package manager (pnpm, npm, or yarn)
- ✅ Validates that you're in an Astro project
- ✅ Skips already installed dependencies
- ✅ Shows clear progress and next steps

## Requirements

- An existing Astro project
- Node.js 18 or higher

## Options

### `--force`

Install even if Astro is not detected in package.json:

```bash
pnpm create db-ux-astro --force
```

## License

Apache-2.0
