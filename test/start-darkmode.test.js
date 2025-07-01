import { describe, test } from "node:test";
import { strict as assert } from "assert";
import { mkdtempSync, writeFileSync, rmSync, chmodSync, mkdirSync, copyFileSync, existsSync } from "fs";
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

describe("darkmode start", () => {
  test("npm run start succeeds after build", async () => {
    const tmp = mkdtempSync(join(tmpdir(), "scaffold-test-"));
    const { dir: npmDir } = createNpmStub();
    const originalPath = process.env.PATH;
    process.env.PATH = `${npmDir}:${originalPath}`;
    const cwd = process.cwd();
    process.chdir(tmp);
    try {
      const answers = {
        appName: "ok-app",
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
      copyFileSync(join(outDir, "src", "darkmode.js"), join(dist, "darkmode.js"));
      copyFileSync(join(outDir, "index.html"), join(dist, "index.html"));
      createElectronStub(outDir);
      const { exitCode } = await execa("node", ["dist/main.js"], { cwd: outDir });
      assert.equal(exitCode, 0);
      assert.ok(existsSync(join(dist, "darkmode.js")));
    } finally {
      process.chdir(cwd);
      process.env.PATH = originalPath;
      rmSync(tmp, { recursive: true, force: true });
      rmSync(npmDir, { recursive: true, force: true });
    }
  });
});
