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

function createGitStub() {
  const dir = mkdtempSync(join(tmpdir(), "git-stub-"));
  const stub = join(dir, "git");
  writeFileSync(
    stub,
    [
      "#!/bin/sh",
      "cmd=$1",
      "shift",
      "case \"$cmd\" in",
      "  init)",
      "    mkdir -p .git",
      "    ;;",
      "  add)",
      "    ;;",
      "  commit)",
      "    mkdir -p .git",
      "    echo \"$@\" > .git/last_commit",
      "    ;;",
      "esac",
      "exit 0",
      ""
    ].join("\n")
  );
  chmodSync(stub, 0o755);
  return { dir, stub };
}

describe("git init feature", () => {
  test("initializes repository and commits", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const { dir: gitDir } = createGitStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${gitDir}:${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "git-app",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: [],
        features: ["git"],
      };
      const { outDir } = await scaffoldProject(answers);
      assert.ok(existsSync(join(outDir, ".git")));
      assert.ok(existsSync(join(outDir, ".git", "last_commit")));
      const msg = readFileSync(join(outDir, ".git", "last_commit"), "utf8");
      assert.ok(msg.includes("Initial"));
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
      rmSync(gitDir, { recursive: true, force: true });
    }
  });
});
