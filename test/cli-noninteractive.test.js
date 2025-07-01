import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";

function createNpmStub() {
  const dir = mkdtempSync(join(tmpdir(), "npm-stub-"));
  const stub = join(dir, "npm");
  writeFileSync(stub, "#!/bin/sh\nexit 0\n");
  chmodSync(stub, 0o755);
  return { dir, stub };
}

describe("cli noninteractive", () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const cli = join(__dirname, "..", "bin", "index.js");

  test("fails without answers file in CI", async () => {
    const { exitCode } = await execa("node", [cli], { reject: false });
    assert.equal(exitCode, 1);
  });

  test("scaffolds using answers file", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "cli-answers-"));
    const answers = {
      appName: "ci-app",
      title: "Test",
      description: "",
      author: "",
      license: "MIT",
      scripts: [],
      features: []
    };
    const answersPath = join(tmp, "answers.json");
    writeFileSync(answersPath, JSON.stringify(answers));
    const { dir: npmDir } = createNpmStub();
    const origPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${origPath}`;
    try {
      await execa("node", [cli, "--answers", answersPath], { cwd: tmp });
      assert.ok(existsSync(join(tmp, answers.appName, "package.json")));
    } finally {
      process.env.PATH = origPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
