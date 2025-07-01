import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync, mkdirSync, cpSync } from "fs";
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

function copyPackageFixtures(outDir) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const fixtures = join(__dirname, "fixtures");
  const pkgs = ["typescript", "vite", "@types/node"];
  for (const pkg of pkgs) {
    const src = join(fixtures, pkg);
    const dest = join(outDir, "node_modules", pkg);
    cpSync(src, dest, { recursive: true });
  }
  const binDir = join(outDir, "node_modules", ".bin");
  mkdirSync(binDir, { recursive: true });
  cpSync(join(fixtures, "typescript", "tsc.js"), join(binDir, "tsc"));
  chmodSync(join(binDir, "tsc"), 0o755);
  cpSync(join(fixtures, "vite", "vite.js"), join(binDir, "vite"));
  chmodSync(join(binDir, "vite"), 0o755);
}

describe("tsconfig", () => {
  test("tsc runs cleanly for minimal setup", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "tsc-test-"));
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
        scripts: [],
        features: ["preload"],
      };
      const { outDir } = await scaffoldProject(answers);
      process.env.PATH = originalPath;

      const shim = join(outDir, "src", "shims.d.ts");
      writeFileSync(
        shim,
        [
          "declare module 'electron';",
          "declare module 'react';",
          "declare module 'react-dom';",
          "declare module 'react-dom/client';",
          "declare module 'vite/client';",
          "declare global { interface Window { api: any } }",
          "export {};",
          "",
        ].join("\n")
      );

      copyPackageFixtures(outDir);

      const { stdout } = await execa("npx", ["tsc", "--noEmit"], { cwd: outDir });
      assert.equal(stdout.trim(), "");
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
