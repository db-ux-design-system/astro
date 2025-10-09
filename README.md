# @db-ux/astro

![Default Pipeline](https://github.com/db-ux-design-system/astro/actions/workflows/default.yml/badge.svg)

This is a monorepo containing various packages relating to [🚀 Astro](https://astro.build/). Astro is a web framework optimized for building fast, content-driven websites. It is an excellent match with the core `@db-ux` packages since its framework-agnostic and makes it very easy to build static or hybrid websites.

The monorepo contains the following packages:

- `@db-ux/astro` - An astro integration that is the core component of this repository. It makes it incredibly easy to bootstrap astro projects that make full use of our `@db-ux/core-*` packages.

## Contribution

Before contributing, please make sure to familiarize yourself with our [code of conduct](CODE-OF-CONDUCT.md).

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

```bashe
pnpm dev:astro
```

### Useful Commands

- `pnpm check` - Perform all code checks (like linting, format and type checks)
- `pnpm lint` - Lint entire project
- `pnpm format` - Format entire project
- `pnpm test` - Execute all tests
