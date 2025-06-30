// File: src/generator.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fullScriptMap } from "./config/scripts.js";
import { renderTemplateFiles } from "./utils/render.js";
import { copyDirRecursive, ensureDir } from "./utils/fileOps.js";
import { execa } from "execa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function scaffoldProject(answers) {
  const outDir = path.resolve(process.cwd(), answers.appName);
  await ensureDir(outDir);

  // Validate appName folder does not already exist to prevent overwrite
  if (fs.existsSync(outDir) && fs.readdirSync(outDir).length > 0) {
    throw new Error(`Target directory '${outDir}' already exists and is not empty.`);
  }

  // Generate package.json
  const pkg = {
    name: answers.appName,
    version: "0.1.0",
    description: answers.description,
    author: answers.author,
    license: answers.license,
    scripts: {},
  };

  for (const key of answers.scripts) {
    if (fullScriptMap[key]) {
      pkg.scripts[key] = fullScriptMap[key];
    }
  }

  fs.writeFileSync(path.join(outDir, "package.json"), JSON.stringify(pkg, null, 2));

  // Always copy base + prettier + darkmode templates
  const alwaysCopy = ["base", "with-prettier", "with-darkmode"];
  for (const folder of alwaysCopy) {
    const srcPath = path.resolve(__dirname, `../templates/${folder}`);
    if (fs.existsSync(srcPath)) {
      await copyDirRecursive(srcPath, outDir);
    }
  }

  // Conditionally copy user selected features (excluding prettier, darkmode)
  const optionalFeatures = answers.features.filter(f => !alwaysCopy.includes(`with-${f}`));
  for (const feature of optionalFeatures) {
    const srcPath = path.resolve(__dirname, `../templates/with-${feature}`);
    if (fs.existsSync(srcPath)) {
      await copyDirRecursive(srcPath, outDir);
    }
  }

  // Inject tokens into copied files
  await renderTemplateFiles(outDir, {
    APP_NAME: answers.appName,
    WINDOW_TITLE: answers.title,
    AUTHOR: answers.author,
    LICENSE: answers.license,
  });

  // Run npm install
  console.log("\n🔧 Installing dependencies...");
  await execa("npm", ["install"], { cwd: outDir, stdio: "inherit" });

  // Initialize git if selected
  if (answers.features.includes("git")) {
    console.log("\n🔧 Initializing Git repository...");
    await execa("git", ["init"], { cwd: outDir });
    await execa("git", ["add", "."], { cwd: outDir });
    await execa("git", ["commit", "-m", "Initial scaffold commit"], { cwd: outDir });
  }

  return {
    outDir,
    metadata: answers,
    packageJson: pkg,
  };
}
