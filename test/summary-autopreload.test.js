import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { scaffoldProject } from "../src/generator.js";
import { showSummaryReport } from "../src/report.js";

function createNpmStub() {
  const dir = mkdtempSync(join(tmpdir(), "npm-stub-"));
  const stub = join(dir, "npm");
  writeFileSync(stub, "#!/bin/sh\nexit 0\n");
  chmodSync(stub, 0o755);
  return { dir, stub };
}

describe("summary", () => {
  test("preload flagged as auto", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "sum-app",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: [],
        features: ["darkmode"],
      };
      const result = await scaffoldProject(answers);
      let output = "";
      const orig = console.log;
      console.log = (msg) => { output += msg; };
      await showSummaryReport(result);
      console.log = orig;
      assert.match(output, /preload \(auto\)/);
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
