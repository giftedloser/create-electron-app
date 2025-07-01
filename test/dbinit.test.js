import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { scaffoldProject } from "../src/generator.js";

function createNpmStub() {
  const dir = mkdtempSync(join(tmpdir(), "npm-stub-"));
  const stub = join(dir, "npm");
  writeFileSync(stub, "#!/bin/sh\nexit 0\n");
  chmodSync(stub, 0o755);
  return { dir, stub };
}

describe("dbinit script", () => {
  test("added when selected", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "sqlite-app",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: ["dbinit"],
        features: ["sqlite"],
      };
      const { outDir } = await scaffoldProject(answers);
      const pkg = JSON.parse(readFileSync(join(outDir, "package.json"), "utf8"));
      assert.ok(pkg.scripts.dbinit);
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });

  test("omitted when not selected", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "no-script-app",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: [],
        features: ["sqlite"],
      };
      const { outDir } = await scaffoldProject(answers);
      const pkg = JSON.parse(readFileSync(join(outDir, "package.json"), "utf8"));
      assert.ok(!pkg.scripts.dbinit);
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
