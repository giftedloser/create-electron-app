import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, existsSync, rmSync, chmodSync, readFileSync } from "fs";
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

describe("darkmode feature", () => {
  test("copies darkmode files and injects import", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "dark-app",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: [],
        features: ["darkmode"],
      };
      const { outDir, metadata } = await scaffoldProject(answers);
      const file = join(outDir, "darkmode.js");
      assert.ok(existsSync(file));
      const mainFile = readFileSync(join(outDir, "src", "main.ts"), "utf8");
      const matches = mainFile.match(/import '\.\/darkmode\.js';/g) || [];
      assert.equal(matches.length, 1);
      assert.ok(existsSync(join(outDir, "src", "preload.ts")));
      assert.ok(metadata.features.includes("preload"));
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
