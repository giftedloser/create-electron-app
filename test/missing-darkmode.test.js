import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync, readFileSync, mkdirSync, copyFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { execa } from "execa";
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
    "export const app = { whenReady: async () => ({ then: (fn) => fn() }), on() {}, quit() {} };",
    "export class BrowserWindow { constructor(){} static getAllWindows(){return []} loadURL(){} loadFile(){} webContents={openDevTools(){}} };",
    "export const ipcMain = { handle() {} };",
    "export const nativeTheme = { shouldUseDarkColors: false, on() {} };",
  ].join("\n");
  writeFileSync(join(modDir, "index.js"), content);
}

describe("darkmode runtime", () => {
  test("throws when dist/darkmode.js missing", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "err-app",
        title: "Test",
        description: "",
        author: "",
        license: "MIT",
        scripts: ["start"],
        features: ["darkmode"],
      };
      const { outDir } = await scaffoldProject(answers);
      const dist = join(outDir, "dist");
      mkdirSync(dist, { recursive: true });
      copyFileSync(join(outDir, "src", "main.ts"), join(dist, "main.js"));
      copyFileSync(join(outDir, "index.html"), join(dist, "index.html"));
      createElectronStub(outDir);
      let failed = false;
      try {
        await execa("node", ["dist/main.js"], { cwd: outDir });
      } catch (e) {
        failed = true;
        assert.match(e.stderr, /Missing dist\/darkmode\.js/);
      }
      if (!failed) throw new Error("start should fail");
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
