#!/usr/bin/env node
// File: bin/index.js

import gradient from "gradient-string";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { createAppWizard } from "../src/wizard.js";
import { scaffoldProject } from "../src/generator.js";
import { showSummaryReport } from "../src/report.js";
import { info, error as logError } from "../src/utils/logger.js";

const title = `
    __ ____    ___  ____ ______   ___         ___ _       ___    __ ______ ____   ___  ____         ____ ____  ____  
   /  |    \  /  _]/    |      | /  _]       /  _| |     /  _]  /  |      |    \ /   \|    \       /    |    \|    \ 
  /  /|  D  )/  [_|  o  |      |/  [_ _____ /  [_| |    /  [_  /  /|      |  D  |     |  _  |_____|  o  |  o  |  o  )
 /  / |    /|    _|     |_|  |_|    _|     |    _| |___|    _]/  / |_|  |_|    /|  O  |  |  |     |     |   _/|   _/ 
/   \_|    \|   [_|  _  | |  | |   [_|_____|   [_|     |   [_/   \_  |  | |    \|     |  |  |_____|  _  |  |  |  |   
\     |  .  |     |  |  | |  | |     |     |     |     |     \     | |  | |  .  |     |  |  |     |  |  |  |  |  |   
 \____|__|\_|_____|__|__| |__| |_____|     |_____|_____|_____|\____| |__| |__|\_|\___/|__|__|     |__|__|__|  |__|                                                                                                                      
`;

console.clear();
console.log(gradient.rainbow.multiline(title));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"));

const args = process.argv.slice(2);
if (args.includes("-v") || args.includes("--version")) {
  console.log(`v${pkg.version}`);
  process.exit(0);
}
if (args.includes("-h") || args.includes("--help")) {
  console.log("Usage: create-electron-app [options]\n" +
    "Run without options to start the interactive wizard.\n" +
    "The wizard lets you choose npm, yarn or pnpm for dependency installation.\n" +
    "  -h, --help     Show this help\n" +
    "  -v, --version  Show CLI version");
  process.exit(0);
}

async function main() {
  try {
    info("🛠️  create-electron-app CLI\n-----------------------------");

    const answers = await createAppWizard();

    const skipInstall = process.env.SKIP_INSTALL === "1";
    const result = await scaffoldProject(answers, { skipInstall });

    await showSummaryReport(result);

    process.exit(0);
  } catch (err) {
    logError("\n❌ Error:", err.message);
    process.exit(1);
  }
}

main();

