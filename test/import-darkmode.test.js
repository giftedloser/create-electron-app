import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync, mkdirSync } from "fs";
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

function createElectronStub(outDir) {
  const modDir = join(outDir, "node_modules", "electron");
  mkdirSync(modDir, { recursive: true });
  const content = [
    "export const nativeTheme = { shouldUseDarkColors: false, on() {} };",
    "export const ipcMain = { handle() {} };",
    "export const BrowserWindow = { getAllWindows() { return [] } };",
  ].join("\n");
  writeFileSync(join(modDir, "index.js"), content);
}

describe("darkmode module", () => {
  test("importing does not throw", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "import-app",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: [],
        features: ["darkmode"],
      };
      const { outDir } = await scaffoldProject(answers);
      createElectronStub(outDir);
      await import(join(outDir, "src", "darkmode.js"));
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
    assert.ok(true);
  });
});
