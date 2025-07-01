import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { execa } from "execa";
import { scaffoldProject } from "../src/generator.js";

function createNpmStub() {
  const dir = mkdtempSync(join(tmpdir(), "npm-stub-"));
  const stub = join(dir, "npm");
  writeFileSync(stub, "#!/bin/sh\nexit 0\n");
  chmodSync(stub, 0o755);
  return { dir, stub };
}

function createTscStub(dir) {
  const bin = join(dir, "tsc");
  const script = [
    "#!/usr/bin/env node",
    "const fs=require('fs');",
    "const path=require('path');",
    "const dist=path.join(process.cwd(),'dist');",
    "fs.mkdirSync(dist,{recursive:true});",
    "fs.writeFileSync(path.join(dist,'main.js'),'');",
    "fs.writeFileSync(path.join(dist,'darkmode.js'),'');",
  ].join('\n');
  writeFileSync(bin, script);
  chmodSync(bin, 0o755);
  return bin;
}

describe("tsc output", () => {
  test("dist contains js files", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "tsc-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "tsc-out",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: [],
        features: ["darkmode"],
      };
      const { outDir } = await scaffoldProject(answers);
      const tscDir = mkdtempSync(join(tmpdir(), 'tsc-bin-'));
      createTscStub(tscDir);
      process.env.PATH = `${tscDir}:${process.env.PATH}`;
      await execa('tsc', [], { cwd: outDir });
      assert.ok(existsSync(join(outDir, 'dist', 'darkmode.js')));
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
