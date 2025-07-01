import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import prompts from "prompts";
import { createAppWizard } from "../src/wizard.js";
import { scaffoldProject } from "../src/generator.js";

function createNpmStub() {
  const dir = mkdtempSync(join(tmpdir(), "npm-stub-"));
  const stub = join(dir, "npm");
  writeFileSync(stub, "#!/bin/sh\nexit 0\n");
  chmodSync(stub, 0o755);
  return { dir, stub };
}

describe("wizard frameless", () => {
  test("selecting frameless adds preload and keeps file", async () => {
    prompts.inject([
      "wiz-frame", // appName
      "Title", // title
      "", // description
      "", // author
      "MIT", // license
      ["frameless"], // features
      "npm",
      ["dev"], // scripts
      true, // confirm
    ]);
    const answers = await createAppWizard();
    assert.ok(answers.features.includes("preload"));

    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const { outDir } = await scaffoldProject(answers);
      assert.ok(existsSync(join(outDir, "src", "preload.ts")));
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
