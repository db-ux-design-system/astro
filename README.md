# @db-ux/astro

![Default Pipeline](https://github.com/db-ux-design-system/astro/actions/workflows/default.yml/badge.svg)
![GitHub Repo stars](https://img.shields.io/github/stars/db-ux-design-system/astro)
![GitHub License](https://img.shields.io/github/license/db-ux-design-system/astro)

## Overview

This is a monorepo containing various packages relating to [🚀 Astro](https://astro.build/). Astro is a web framework optimized for building fast, content-driven websites. It is an excellent match with the core `@db-ux` packages since its framework-agnostic and makes it very easy to build static or hybrid websites.

The monorepo contains the following packages:

- `@db-ux/astro` - An astro integration that is the core component of this repository. It makes it incredibly easy to bootstrap astro projects that make full use of our `@db-ux/core-*` packages.
- `@db-ux/create-astro` - An installation script that helps you setup your astro project quickly.

## Documentation

Please visit our [Documentation](https://design-system.deutschebahn.com/astro/) for more information.

## Contribution

Before contributing, please make sure to familiarize yourself with our [code of conduct](https://github.com/db-ux-design-system/astro/blob/main/CODE-OF-CONDUCT.md).

### Setup

Start by checking out this repository:

```bash
git clone git@github.com:db-ux-design-system/astro.git
cd astro
```

Next, wee recommend using nvm to ensure you're using the proper node version:

```bash
nvm install
nvm use
```

Now you can proceed with installing dependencies and initializing the repository:

```bash
pnpm -r i
pnpm prepare
```

Now you may start developing, e.g. by running:

```bash
pnpm dev
```

### Useful Commands

- `pnpm dev` - Start the development server.
- `pnpm check` - Perform all code checks (like linting, format and type checks)
- `pnpm lint` - Lint entire project
- `pnpm format` - Format entire project
- `pnpm test` - Execute all tests

## TODO

- support for custom html & css
- automated navigation
- subnav/sidebar nav support
- landing page layout
