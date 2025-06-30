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

  // Build package.json with selected scripts and dependencies
  const pkg = {
    name: answers.appName,
    version: "0.1.0",
    description: answers.description,
    author: answers.author,
    license: answers.license,
    scripts: {},
    dependencies: {},
  };
  for (const key of answers.scripts) {
    if (fullScriptMap[key]) {
      pkg.scripts[key] = fullScriptMap[key];
    }
  }
  pkg.dependencies = dependencies;

  try {
    await fs.writeFile(
      path.join(outDir, "package.json"),
      JSON.stringify(pkg, null, 2),
      "utf8"
    );
  } catch (e) {
    throw new Error(`Failed to write package.json: ${e.message}`);
  }

  // Copy base template always
  const baseTemplateDir = path.resolve(__dirname, "../templates/base");
  try {
    await copyDirRecursive(baseTemplateDir, outDir);
  } catch (e) {
    throw new Error(`Failed copying base templates: ${e.message}`);
  }

  // Copy feature templates conditionally
  for (const feature of answers.features) {
    if (feature === "prettier" || feature === "darkmode" || feature === "git") {
      // skip features that don't have templates or are handled separately
      continue;
    }
    const featureTemplateDir = path.resolve(__dirname, `../templates/with-${feature}`);
    try {
      await fs.access(featureTemplateDir);
      await copyDirRecursive(featureTemplateDir, outDir);
    } catch {
      // No template for feature; silently continue
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
    throw new Error(`Template token rendering failed: ${e.message}`);
  }

  // Install dependencies
  try {
    info("🔧 Installing dependencies...");
    await execa("npm", ["install"], { cwd: outDir, stdio: "inherit" });
  } catch (e) {
    throw new Error(`npm install failed: ${e.message}`);
  }

  // Initialize Git repo if selected
  if (answers.features.includes("git")) {
    try {
      info("🔧 Initializing Git repository...");
      await execa("git", ["init"], { cwd: outDir });
      await execa("git", ["add", "."], { cwd: outDir });
      await execa("git", ["commit", "-m", "Initial scaffold commit"], { cwd: outDir });
    } catch (e) {
      warn(`Git initialization failed: ${e.message}`);
    }
  }

  return {
    outDir,
    metadata: answers,
    packageJson: pkg,
  };
}
