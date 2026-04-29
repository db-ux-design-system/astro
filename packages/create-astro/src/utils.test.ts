import { describe, it, expect, vi } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import {
  resolvePackageJson,
  detectPackageManager,
  installDependencies,
  cancel,
  done,
  handleUnexpectedError,
} from './utils.js';
import { PackageManager } from './types.js';
import { execSync } from 'node:child_process';

describe('resolvePackageJson', () => {
  it('should resolve an existing package.json', () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      return String(path).endsWith('package.json');
    });
    vi.mocked(readFileSync).mockImplementation((path, encoding) => {
      if (String(path).endsWith('package.json') && encoding === 'utf-8') {
        return JSON.stringify({
          name: 'test-package',
          version: '1.0.0',
          dependencies: [],
        });
      }
      throw new Error('File not found');
    });
    expect(() => {
      const pkgJson = resolvePackageJson();
      expect(pkgJson).toBeDefined();
    }).not.toThrow();
    vi.mocked(existsSync).mockReset();
  });

  it("should throw an error if package.json doesn't exist", () => {
    vi.mocked(existsSync).mockReturnValue(false);
    expect(() => resolvePackageJson()).toThrow('Could not find package.json');
    vi.mocked(existsSync).mockReset();
  });

  it('should throw an error if package.json cannot be read', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockImplementation(() => {
      throw new Error('Failed to read file');
    });
    expect(() => resolvePackageJson()).toThrow('Could not read package.json');
    vi.mocked(existsSync).mockReset();
    vi.mocked(readFileSync).mockReset();
  });
});

describe('detectPackageManager', () => {
  it('should detect pnpm', () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      return String(path).endsWith('pnpm-lock.yaml');
    });
    const result = detectPackageManager();
    expect(result).toBe(PackageManager.pnpm);
    vi.mocked(existsSync).mockReset();
  });

  it('should detect yarn', () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      return String(path).endsWith('yarn.lock');
    });
    const result = detectPackageManager();
    expect(result).toBe(PackageManager.yarn);
    vi.mocked(existsSync).mockReset();
  });

  it('should detect npm', () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      return String(path).endsWith('package-lock.json');
    });
    const result = detectPackageManager();
    expect(result).toBe(PackageManager.npm);
    vi.mocked(existsSync).mockReset();
  });

  it('should throw an error if package manager cannot be identified', () => {
    expect(() => detectPackageManager()).toThrow(
      'Could not identify package manager.'
    );
  });

  it('should detect pnpm lockfile in a parent directory (monorepo)', () => {
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/monorepo/packages/app');
    vi.mocked(existsSync).mockImplementation((path) => {
      return String(path) === '/fake/monorepo/pnpm-lock.yaml';
    });
    const result = detectPackageManager();
    expect(result).toBe(PackageManager.pnpm);
    vi.mocked(existsSync).mockReset();
    vi.restoreAllMocks();
  });

  it('should detect yarn lockfile in a parent directory (monorepo)', () => {
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/monorepo/packages/app');
    vi.mocked(existsSync).mockImplementation((path) => {
      return String(path) === '/fake/monorepo/yarn.lock';
    });
    const result = detectPackageManager();
    expect(result).toBe(PackageManager.yarn);
    vi.mocked(existsSync).mockReset();
    vi.restoreAllMocks();
  });

  it('should prefer a closer lockfile over one in a parent directory', () => {
    vi.spyOn(process, 'cwd').mockReturnValue('/fake/monorepo/packages/app');
    vi.mocked(existsSync).mockImplementation((path) => {
      // yarn at cwd, pnpm at root — cwd should win
      return (
        String(path) === '/fake/monorepo/packages/app/yarn.lock' ||
        String(path) === '/fake/monorepo/pnpm-lock.yaml'
      );
    });
    const result = detectPackageManager();
    expect(result).toBe(PackageManager.yarn);
    vi.mocked(existsSync).mockReset();
    vi.restoreAllMocks();
  });

  it('should find a lockfile exactly at MAX_DEPTH (3 levels up)', () => {
    // cwd = /a/b/c/d, lockfile at /a/pnpm-lock.yaml — exactly 3 levels up, should be found
    vi.spyOn(process, 'cwd').mockReturnValue('/a/b/c/d');
    vi.mocked(existsSync).mockImplementation((path) => {
      return String(path) === '/a/pnpm-lock.yaml';
    });
    expect(detectPackageManager()).toBe(PackageManager.pnpm);
    vi.mocked(existsSync).mockReset();
    vi.restoreAllMocks();
  });

  it('should not find a lockfile beyond MAX_DEPTH (4 levels up)', () => {
    // cwd = /a/b/c/d/e, lockfile at /a/pnpm-lock.yaml — 4 levels up, should be missed
    vi.spyOn(process, 'cwd').mockReturnValue('/a/b/c/d/e');
    vi.mocked(existsSync).mockImplementation((path) => {
      return String(path) === '/a/pnpm-lock.yaml';
    });
    expect(() => detectPackageManager()).toThrow(
      'Could not identify package manager.'
    );
    vi.mocked(existsSync).mockReset();
    vi.restoreAllMocks();
  });
});

describe('installDependencies', () => {
  it('should install dependencies using pnpm', async () => {
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));

    await installDependencies(['dep1', 'dep2'], PackageManager.pnpm);

    expect(execSync).toHaveBeenCalledWith(
      'pnpm add dep1 dep2',
      expect.objectContaining({
        stdio: 'inherit',
        cwd: expect.any(String),
      })
    );
  });

  it('should install dependencies using npm', async () => {
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));

    await installDependencies(['dep1', 'dep2'], PackageManager.npm);

    expect(execSync).toHaveBeenCalledWith(
      'npm install dep1 dep2',
      expect.objectContaining({
        stdio: 'inherit',
        cwd: expect.any(String),
      })
    );
  });

  it('should install dependencies using yarn', async () => {
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));

    await installDependencies(['dep1', 'dep2'], PackageManager.yarn);

    expect(execSync).toHaveBeenCalledWith(
      'yarn add dep1 dep2',
      expect.objectContaining({
        stdio: 'inherit',
        cwd: expect.any(String),
      })
    );
  });

  it('should throw error when installation fails', async () => {
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('Installation failed');
    });

    await expect(
      installDependencies(['dep1'], PackageManager.pnpm)
    ).rejects.toThrow('Failed to install dependencies using pnpm');
  });
});

describe('done', () => {
  it('should call process.exit with code 0', () => {
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    done();
    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});

describe('cancel', () => {
  it('should call process.exit with code 1', async () => {
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    cancel();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});

describe('handleUnexpectedError', () => {
  it('should handle unexpected errors', () => {
    const error = new Error('Unexpected error');
    const exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    handleUnexpectedError(error);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
