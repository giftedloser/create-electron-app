// File: src/generator.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { fullScriptMap } from "./config/scripts.js";
import { copyDirRecursive, ensureDir } from "./utils/fileOps.js";
import { renderTemplateFiles } from "./utils/render.js";
import { info, warn } from "./utils/logger.js";
import { execa } from "execa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function scaffoldProject(answers) {
  const outDir = path.resolve(process.cwd(), answers.appName);

  // helper to remove the project directory on failure
  const cleanupProject = async () => {
    try {
      await fs.rm(outDir, { recursive: true, force: true });
    } catch (err) {
      warn(`Failed to clean up '${outDir}': ${err.message}`);
    }
  };

  // Prevent overwriting non-empty existing folder
  try {
    await ensureDir(outDir);
  } catch (e) {
    throw new Error(`Failed to ensure project directory: ${e.message}`);
  }

  const filesInDir = await fs.readdir(outDir);
  if (filesInDir.length > 0) {
    throw new Error(`Target directory '${outDir}' exists and is not empty.`);
  }

  // Define required dependencies explicitly
  const dependencies = {
    vite: "^4.0.0",
    "@vitejs/plugin-react": "^3.0.0",
    react: "^18.0.0",
    "react-dom": "^18.0.0",
    electron: "^25.0.0"
  };

  const devDependencies = {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0"
  };

  const featurePackages = {
    sqlite: { dependencies: { "better-sqlite3": "^12.2.0" } },
    prettier: { devDependencies: { prettier: "^3.6.2" } },
    eslint: {
      devDependencies: {
        eslint: "^9.30.0",
        "@typescript-eslint/parser": "^7.0.0",
        "@typescript-eslint/eslint-plugin": "^7.0.0",
      },
    },
  };

  // Build package.json with selected scripts and dependencies
  const pkg = {
    name: answers.appName,
    version: "0.1.0",
    description: answers.description,
    author: answers.author,
    license: answers.license,
    type: "module",
    scripts: {},
    dependencies: {},
    devDependencies: {},
  };
  for (const key of answers.scripts) {
    if (fullScriptMap[key]) {
      pkg.scripts[key] = fullScriptMap[key];
    }
  }

  if (answers.features.includes("sqlite")) {
    pkg.scripts["dbinit"] = fullScriptMap.dbinit;
  }
  pkg.dependencies = { ...dependencies };
  Object.assign(pkg.devDependencies, devDependencies);

  for (const feature of answers.features) {
    const packs = featurePackages[feature];
    if (!packs) continue;
    if (packs.dependencies) {
      Object.assign(pkg.dependencies, packs.dependencies);
    }
    if (packs.devDependencies) {
      Object.assign(pkg.devDependencies, packs.devDependencies);
    }
  }

  // Script-specific dev dependencies
  if (answers.scripts.includes("dist")) {
    pkg.devDependencies["electron-builder"] = "^26.0.0";
  }
  if (answers.scripts.includes("clean") || answers.scripts.includes("reset")) {
    pkg.devDependencies["rimraf"] = "^6.0.1";
  }

  try {
    await fs.writeFile(
      path.join(outDir, "package.json"),
      JSON.stringify(pkg, null, 2),
      "utf8"
    );
  } catch (e) {
    await cleanupProject();
    throw new Error(`Failed to write package.json: ${e.message}`);
  }

  // Copy base template always
  const baseTemplateDir = path.resolve(__dirname, "../templates/base");
  try {
    await copyDirRecursive(baseTemplateDir, outDir);
  } catch (e) {
    await cleanupProject();
    throw new Error(`Failed copying base templates: ${e.message}`);
  }

  // Include preload script only if feature selected
  const preloadFile = path.join(outDir, "src", "preload.ts");
  const mainFile = path.join(outDir, "src", "main.ts");
  if (!answers.features.includes("preload")) {
    try {
      await fs.rm(preloadFile, { force: true });
    } catch {
      // ignore if file does not exist
    }

    // Remove preload property from BrowserWindow options
    try {
      let mainContent = await fs.readFile(mainFile, "utf8");
      const lines = mainContent.split(/\r?\n/);
      const idx = lines.findIndex((l) => l.includes("preload"));
      if (idx !== -1) {
        lines.splice(idx, 1);
        if (idx - 1 >= 0) {
          lines[idx - 1] = lines[idx - 1].replace(/,\s*$/, "");
        }
      }
      // Remove import path line if unused
      const pathImportIdx = lines.findIndex((l) =>
        /^import\s+path\s+from\s+["']path["']/.test(l)
      );
      if (pathImportIdx !== -1) {
        const stillUsesPath = lines.some(
          (l, i) => i !== pathImportIdx && l.includes("path.")
        );
        if (!stillUsesPath) {
          lines.splice(pathImportIdx, 1);
        }
      }
      await fs.writeFile(mainFile, lines.join("\n"));
    } catch {
      // ignore modification errors
    }
  }

  // Copy feature templates conditionally
  for (const feature of answers.features) {
    if (feature === "git") {
      // skip features handled separately
      continue;
    }
    const featureTemplateDir = path.resolve(
      __dirname,
      `../templates/with-${feature}`
    );
    try {
      await fs.access(featureTemplateDir);
      await copyDirRecursive(featureTemplateDir, outDir);
    } catch {
      // No template for feature; silently continue
    }
  }

  // Include electron-builder config if dist script selected
  if (answers.scripts.includes("dist")) {
    const builderTemplate = path.resolve(__dirname, "../templates/with-dist");
    try {
      await fs.access(builderTemplate);
      await copyDirRecursive(builderTemplate, outDir);
    } catch {
      // ignore if template missing
    }
  }

  // Inject tokens (appName, title, author, license) into templates
  try {
    await renderTemplateFiles(outDir, {
      APP_NAME: answers.appName,
      WINDOW_TITLE: answers.title,
      AUTHOR: answers.author,
      LICENSE: answers.license,
    });
  } catch (e) {
    await cleanupProject();
    throw new Error(`Template token rendering failed: ${e.message}`);
  }

  // Install dependencies
  try {
    info("🔧 Installing dependencies...");
    await execa("npm", ["install"], { cwd: outDir, stdio: "inherit" });
  } catch (e) {
    await cleanupProject();
    throw new Error(`npm install failed: ${e.message}. Project directory cleaned up.`);
  }

  // Initialize Git repo if selected
  if (answers.features.includes("git")) {
    try {
      info("🔧 Initializing Git repository...");
      await execa("git", ["init"], { cwd: outDir });
      await execa("git", ["add", "."], { cwd: outDir });
      await execa("git", ["commit", "-m", "Initial scaffold commit"], { cwd: outDir });
    } catch (e) {
      // remove .git to avoid half-baked repo
      try {
        await fs.rm(path.join(outDir, ".git"), { recursive: true, force: true });
      } catch {}
      await cleanupProject();
      throw new Error(`Git initialization failed: ${e.message}. Cleaned up project directory.`);
    }
  }

  return {
    outDir,
    metadata: answers,
    packageJson: pkg,
  };
}
