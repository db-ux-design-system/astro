/* eslint-disable no-console */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { PackageJson, PackageManager } from './types';
import pc from 'picocolors';

/**
 * Detects whether package.json exists in the current working directory.
 */
export function resolvePackageJson(): PackageJson {
  const cwd = process.cwd();
  const packageJsonPath = resolve(cwd, 'package.json');
  if (!existsSync(packageJsonPath)) {
    console.error(
      pc.red('❌ Error: No package.json found in the current directory.')
    );
    console.error(
      pc.dim(
        '   This package is designed for Astro projects. Please run this command in an Astro project root.\n'
      )
    );
    throw new Error('Could not find package.json');
  }

  try {
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    return JSON.parse(packageJsonContent) as PackageJson;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error(pc.red('❌ Error: Could not read package.json'));
    throw new Error('Could not read package.json');
  }
}

/**
 * Detects which package manager is being used in the current project.
 * Walks up the directory tree to support monorepos with a shared lockfile.
 */
export function detectPackageManager(): PackageManager {
  const MAX_DEPTH = 3;
  let dir = process.cwd();

  for (let i = 0; i <= MAX_DEPTH; i++) {
    if (existsSync(resolve(dir, 'pnpm-lock.yaml'))) {
      console.log(pc.dim(`📦 Detected package manager: pnpm\n`));
      return PackageManager.pnpm;
    }
    if (existsSync(resolve(dir, 'yarn.lock'))) {
      console.log(pc.dim(`📦 Detected package manager: yarn\n`));
      return PackageManager.yarn;
    }
    if (existsSync(resolve(dir, 'package-lock.json'))) {
      console.log(pc.dim(`📦 Detected package manager: npm\n`));
      return PackageManager.npm;
    }

    const parent = resolve(dir, '..');
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }

  throw new Error('Could not identify package manager.');
}

/**
 * Installs dependencies using the detected package manager
 */
export async function installDependencies(
  dependencies: readonly string[],
  packageManager: PackageManager
): Promise<void> {
  const deps = dependencies.join(' ');

  let command: string;
  switch (packageManager) {
    case PackageManager.pnpm:
      command = `pnpm add ${deps}`;
      break;
    case PackageManager.yarn:
      command = `yarn add ${deps}`;
      break;
    case PackageManager.npm:
      command = `npm install ${deps}`;
      break;
  }

  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error(`Failed to install dependencies using ${packageManager}`);
  }
}

/**
 * A simple wrapper around `process.exit(0)`.
 */
export function done(): never {
  process.exit(0);
}

/**
 * A simple wrapper around `process.exit(1)`.
 */
export function cancel(): never {
  process.exit(1);
}

export function handleUnexpectedError(error: unknown): never {
  console.error(pc.red('Unexpected error:'), error);
  cancel();
}
