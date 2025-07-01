import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, readFileSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { renderTemplateFiles } from '../src/utils/render.js';

describe('renderTemplateFiles', () => {
  test('replaces tokens in text files', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'render-test-'));
    const file = join(dir, 'file.js');
    writeFileSync(file, 'Hello {{NAME}}');
    await renderTemplateFiles(dir, { NAME: 'World' });
    const result = readFileSync(file, 'utf8');
    assert.equal(result, 'Hello World');
  });

  test('replaces tokens in TSX files', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'render-test-'));
    const file = join(dir, 'component.tsx');
    writeFileSync(file, '<div>{{GREETING}}</div>');
    await renderTemplateFiles(dir, { GREETING: 'Hi' });
    const result = readFileSync(file, 'utf8');
    assert.equal(result, '<div>Hi</div>');
  });
});
