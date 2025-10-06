# DB UX Design System v3 Core Web

DB UX Design System Astro is an Astro-based …

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Required Prerequisites

- **Node.js 24**: Check `.nvmrc` file. Use `node --version` to verify current version.
- **npm**: Package manager for dependency management and build scripts.

### Bootstrap and Setup

1. **CRITICAL**: Copy `.env.template` to `.env` and add your email:

   ```bash
   cp .env.template .env
   # Edit .env file: Set COMMIT_MAIL=your.email@example.com
   ```

2. **Install dependencies**:

   ```bash
   npm install --ignore-scripts
   ```

   **NOTE**: Use the `--ignore-scripts` flag because the chromedriver package attempts to download binaries during installation, which fails in restricted corporate networks (e.g., behind firewalls or proxies). This workaround prevents installation errors in such environments.

### Build and Test

- **Build core packages**:

  ```bash
  npm run build
  ```

  **TIMING**: Takes ~30 seconds. NEVER CANCEL. Set timeout to 120+ seconds.

- **Run tests**:
  ```bash
  npm run test
  ```
  **TIMING**: Takes ~10 seconds. NEVER CANCEL. Set timeout to 60+ seconds.

### Development

- **Start interactive development server**:

  ```bash
  npm run dev
  ```

  **TIMING**: Takes ~30 seconds to start. Runs on <http://localhost:5173/>

## Validation

### Always Run These Commands Before Committing

```bash
npm run build         # Verify core packages build
npm run test          # Verify all tests pass
npm run lint          # NOTE: …
```

## Common Tasks

### Key Repository Locations

```text
├── packages/
│   └── tbd/                # tbd
└── docs/                   # Documentation files
```

### Package Scripts Reference

```bash
# Development
npm run dev                 # Interactive dev server (framework selection)
npm run start              # Start Patternhub documentation site

# Building
npm run build              # Build core packages (~30 seconds)

# Testing & Quality
npm run test               # Run test suite (~10 seconds)
npm run lint               # Run all linters (known issue: may fail if Nuxt showcase hasn't been run yet; see "Known Issues and Workarounds" below)

# Utilities
npm run clean              # Clean build artifacts
```

## Known Issues and Workarounds

### Git hook issues

**Husky blocking git commit**: To prevent Husky blocking commits due to missing `COMMIT_MAIL` within `.env` file, just add `--no-verify` to your `git commit` command:

```bash
git commit -m "Your commit message" --no-verify
```

## Development Workflows

If possible, start by writing a test that you could use to verify your solution, as well as we could use for ongoing regression testing throughout the product's development.

### Debugging Build Issues

1. **Check Node.js version**: Must be v24 (see `.nvmrc`)
2. **Clean rebuild**: `npm run clean && npm run build`
3. **Check dependencies**: `npm install --ignore-scripts`
4. **Isolate issue**: Build individual packages using workspace commands

Remember: This is a … based on the design system used by Deutsche Bahn applications. Always ensure changes maintain accessibility, consistency, and brand compliance.
