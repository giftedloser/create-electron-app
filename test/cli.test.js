import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { execa } from 'execa';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

describe('CLI', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const cli = join(__dirname, '..', 'bin', 'index.js');
  const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

  test('--version prints package version', async () => {
    const { stdout } = await execa('node', [cli, '--version']);
    assert.match(stdout, new RegExp(`v${pkg.version}`));
  });

  test('--help prints usage', async () => {
    const { stdout } = await execa('node', [cli, '--help']);
    assert.match(stdout, /Usage: create-electron-app/);
  });
});
