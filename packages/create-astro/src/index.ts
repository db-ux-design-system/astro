#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import pc from 'picocolors';
import {
  resolvePackageJson,
  detectPackageManager,
  installDependencies,
  cancel,
  done,
  handleUnexpectedError,
} from './utils.js';
import { PackageJson, PackageManager } from './types.js';
import { REQUIRED_DEPENDENCIES } from './config.js';

async function main() {
  console.log(
    pc.cyan(
      "\n🚀 Welcome to the DB UX Astro Installer! Let's get you set up. (⌐■_■)"
    )
  );

  let packageJson: PackageJson;
  try {
    packageJson = resolvePackageJson();
  } catch (error) {
    cancel();
  }

  // Check if Astro is installed
  const hasAstro =
    packageJson.dependencies?.astro || packageJson.devDependencies?.astro;

  if (!hasAstro) {
    console.error(pc.red('❌ Error: Astro is not listed in dependencies.'));
    console.error(
      pc.dim(
        '   This package is designed for Astro projects. Please run this command in an Astro project root.\n'
      )
    );
  }

  // Detect package manager
  let packageManager: PackageManager;
  try {
    packageManager = detectPackageManager();
  } catch (error) {
    console.error(pc.red('❌ Error: Could not detect package manager.'));
    cancel();
  }

  // Check for existing dependencies
  const existingDeps = new Set([
    /* v8 ignore start */
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
    /* v8 ignore stop */
  ]);

  const depsToInstall = REQUIRED_DEPENDENCIES.filter(
    (dep) => !existingDeps.has(dep)
  );
  const alreadyInstalled = REQUIRED_DEPENDENCIES.filter((dep) =>
    existingDeps.has(dep)
  );

  if (alreadyInstalled.length > 0) {
    console.log(pc.green('✅ Already installed:'));
    alreadyInstalled.forEach((dep) => console.log(pc.dim(`  - ${dep}`)));
    console.log();
  }

  if (depsToInstall.length === 0) {
    console.log(pc.green('✅ All dependencies are already installed!\n'));
    done();
  }

  // Show what will be installed
  console.log(pc.cyan('📥 Installing dependencies:'));
  depsToInstall.forEach((dep) => console.log(pc.dim(`  - ${dep}`)));
  console.log();

  // Install dependencies
  try {
    await installDependencies(depsToInstall, packageManager);
    console.log(
      pc.green(
        '\n✅ Successfully installed @db-ux/astro and peer dependencies!\n'
      )
    );
  } catch (error) {
    console.error(pc.red('\n❌ Installation failed:'));
    /* v8 ignore start */
    console.error(
      pc.dim(error instanceof Error ? error.message : String(error))
    );
    /* v8 ignore stop */
    cancel();
  }

  // Show next steps
  console.log(pc.cyan('Next steps:'));
  console.log(pc.dim('  1. Configure your Astro project to use @db-ux/astro'));
  console.log(
    pc.dim(
      '  2. See the documentation: https://github.com/db-ux-design-system/astro\n'
    )
  );
  done();
}

main().catch((error) => {
  handleUnexpectedError(error);
});
