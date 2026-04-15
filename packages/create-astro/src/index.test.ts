import { existsSync, readFileSync } from 'node:fs';
import {
  it,
  expect,
  vi,
  beforeEach,
  describe,
  type MockInstance,
} from 'vitest';
import { cancel, done } from './utils.js';

vi.mock('./utils.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils.js')>();
  return {
    ...actual,
    cancel: vi.fn(() => {
      throw new Error('exit called');
    }),
    done: vi.fn(() => {}),
    handleUnexpectedError: vi.fn(() => {}),
    installDependencies: vi.fn(() => Promise.resolve()),
  };
});

let consoleErrorSpy: MockInstance;
let consoleLogSpy: MockInstance;
let cancelSpy: MockInstance;
let doneSpy: MockInstance;

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error');
  consoleLogSpy = vi.spyOn(console, 'log');
  cancelSpy = vi.mocked(cancel);
  doneSpy = vi.mocked(done);
});

const runScript = async () => {
  vi.resetModules();
  try {
    await import('./index.js');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // We ignore the error. We simply throw an error to break execution after process.exit is called, so we can assert on it in our tests.
  }
};

describe('main', () => {
  it('should cancel if package.json cannot be found', async () => {
    vi.mocked(existsSync).mockReturnValue(false);
    await runScript();
    expect(cancelSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('No package.json found in the current directory.')
    );
  });

  it("should cancel if package.json can't be read", async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockImplementation(() => {
      throw new Error('Failed to read file');
    });
    vi.mocked(consoleErrorSpy).mockReset();
    vi.mocked(cancelSpy).mockReset();
    await runScript();
    expect(cancelSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Could not read package.json')
    );
  });

  it('should cancel if Astro is not listed in dependencies', async () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      return String(path).endsWith('package.json');
    });
    vi.mocked(readFileSync).mockImplementation(() => {
      return JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {},
        devDependencies: {},
      });
    });
    vi.mocked(consoleErrorSpy).mockReset();
    vi.mocked(cancelSpy).mockReset();
    await runScript();
    expect(cancelSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Astro is not listed in dependencies.')
    );
  });

  it("should cancel if package manager can't be detected", async () => {
    vi.mocked(existsSync).mockImplementation((path) => {
      if (String(path).endsWith('package.json')) {
        return true;
      } else return false;
    });
    vi.mocked(readFileSync).mockImplementation(() => {
      return JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {},
      });
    });
    await runScript();
    expect(cancelSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Could not detect package manager.')
    );
  });

  it('should install all dependencies if Astro is listed', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockImplementation(() => {
      return JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          astro: '^1.0.0',
        },
        devDependencies: {},
      });
    });
    await runScript();
    expect(doneSpy).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(`@db-ux/astro`)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(`react`)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(`react-dom`)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(`@astrojs/react`)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(`@db-ux/core-components`)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(`@db-ux/core-foundations`)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(`@db-ux/db-theme-icons`)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(`@db-ux/react-core-components`)
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Successfully installed @db-ux/astro and peer dependencies!'
      )
    );
  });

  it('should not install dependencies if all are already installed', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockImplementation(() => {
      return JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          astro: '^1.0.0',
          '@db-ux/astro': '^1.0.0',
          react: '^18.0.0',
          'react-dom': '^18.0.0',
          '@astrojs/react': '^1.0.0',
          '@db-ux/core-components': '^1.0.0',
          '@db-ux/core-foundations': '^1.0.0',
          '@db-ux/db-theme-icons': '^1.0.0',
          '@db-ux/react-core-components': '^1.0.0',
        },
        devDependencies: {},
      });
    });
    await runScript();
    expect(doneSpy).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(`✅ Already installed:`)
    );
  });

  it('should print errors if installation fails', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockImplementation(() => {
      return JSON.stringify({
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          astro: '^1.0.0',
        },
        devDependencies: {},
      });
    });
    const errorMessage = 'Installation failed due to network error';
    const { installDependencies } = await import('./utils.js');
    vi.mocked(installDependencies).mockRejectedValue(new Error(errorMessage));
    await runScript();
    expect(cancelSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Installation failed:')
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining(errorMessage)
    );
  });
});
