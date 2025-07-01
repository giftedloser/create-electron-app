import { describe, test } from "node:test";
import { strict as assert } from "assert";
import {
  mkdtempSync,
  writeFileSync,
  rmSync,
  chmodSync,
  existsSync,
} from "fs";
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

describe("wizard script dependencies", () => {
  test("lint script auto-enables eslint feature", async () => {
    prompts.inject([
      "lint-app",
      "Title",
      "",
      "",
      "MIT",
      [],
      "npm",
      ["lint"],
      true,
    ]);
    const answers = await createAppWizard();
    assert.ok(answers.features.includes("eslint"));
  });

  test("format script auto-enables prettier feature", async () => {
    prompts.inject([
      "fmt-app",
      "Title",
      "",
      "",
      "MIT",
      [],
      "npm",
      ["format"],
      true,
    ]);
    const answers = await createAppWizard();
    assert.ok(answers.features.includes("prettier"));

    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const { outDir } = await scaffoldProject(answers);
      assert.ok(existsSync(join(outDir, ".prettierrc")));
      assert.ok(existsSync(join(outDir, ".prettierignore")));
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
