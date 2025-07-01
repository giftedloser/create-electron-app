import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync, existsSync, readFileSync } from "fs";
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

describe("global.d.ts handling", () => {
  test("file removed when preload feature not selected", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "nopreload-app",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: [],
        features: [],
      };
      const { outDir } = await scaffoldProject(answers);
      assert.ok(!existsSync(join(outDir, "src", "global.d.ts")));
      const tsconfig = JSON.parse(readFileSync(join(outDir, "tsconfig.json"), "utf8"));
      assert.ok(!tsconfig.include.includes("src/global.d.ts"));
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
