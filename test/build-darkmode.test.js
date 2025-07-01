import { describe, test } from "node:test";
import { strict as assert } from "assert";
import {
  mkdtempSync,
  writeFileSync,
  rmSync,
  chmodSync,
  mkdirSync,
  cpSync,
  existsSync,
} from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";
import { scaffoldProject } from "../src/generator.js";

function createNpmStub() {
  const dir = mkdtempSync(join(tmpdir(), "npm-stub-"));
  const stub = join(dir, "npm");
  writeFileSync(stub, "#!/bin/sh\nexit 0\n");
  chmodSync(stub, 0o755);
  return { dir, stub };
}

function setupBuildFixtures(outDir) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const fixtures = join(__dirname, "fixtures");
  const pkgs = ["typescript", "vite", "@types/node"];
  for (const pkg of pkgs) {
    const src = join(fixtures, pkg);
    if (existsSync(src)) {
      const dest = join(outDir, "node_modules", pkg);
      cpSync(src, dest, { recursive: true });
    }
  }
  const binDir = join(outDir, "node_modules", ".bin");
  mkdirSync(binDir, { recursive: true });

  const tscStub = `#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const config = JSON.parse(fs.readFileSync('tsconfig.json','utf8'));
const outDir = config.compilerOptions.outDir || 'dist';
function copy(src,dest){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest);}
function build(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const srcPath=path.join(dir,entry.name);if(entry.isDirectory()){build(srcPath);}else if(entry.isFile()){if(entry.name.endsWith('.ts')){const rel=path.relative('src',srcPath);copy(srcPath,path.join(outDir,rel).replace(/\\.ts$/,'.js'));}else if(entry.name.endsWith('.js')){const rel=path.relative('src',srcPath);copy(srcPath,path.join(outDir,rel));}}}}
build('src');
`;
  writeFileSync(join(binDir, "tsc"), tscStub);
  chmodSync(join(binDir, "tsc"), 0o755);
  writeFileSync(join(outDir, "node_modules", "typescript", "tsc.js"), tscStub);
  cpSync(join(fixtures, "vite", "vite.js"), join(binDir, "vite"));
  chmodSync(join(binDir, "vite"), 0o755);
}

describe("build with darkmode", () => {
  test("produces dist/darkmode.js", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "build-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "app",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: ["build"],
        features: ["darkmode"],
      };
      const { outDir } = await scaffoldProject(answers);
      setupBuildFixtures(outDir);
      process.env.PATH = originalPath;
      await execa("npm", ["run", "build"], { cwd: outDir });
      assert.ok(existsSync(join(outDir, "dist", "darkmode.js")));
      assert.ok(existsSync(join(outDir, "dist", "main.js")));
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
