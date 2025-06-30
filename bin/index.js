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
                             __                          .__                 __                                                       
  ___________   ____ _____ _/  |_  ____             ____ |  |   ____   _____/  |________  ____   ____           _____  ______ ______  
_/ ___\\_  __ \\_/ __ \\__  \\   __\\/ __ \\   ______ _/ __ \\|  | _/ __ \\_/ ___\\   __\\_  __ \\/  _ \\ /    \\   ______ \\__  \\ \____ \\____ \\ 
\\  \___|  | \\/\\  ___/ / __ \\|  | \\  ___/  /_____/ \\  ___/|  |_\\  ___/\\  \___|  |  |  | \\(  <_> )   |  \\ /_____/  / __ \\|  |_> >  |_> >
 \___  >__|    \\___  >____  /__|  \\___  >          \\___  >____/\\___  >\\___  >__|  |__|   \\____/|___|  /         (____  /   __/|   __/ 
     \\/            \\/     \\/          \\/               \\/          \\/     \\/                        \\/               \\/|__|   |__|    
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
    "  -h, --help     Show this help\n" +
    "  -v, --version  Show CLI version");
  process.exit(0);
}

async function main() {
  try {
    info("🛠️  create-electron-app CLI\n-----------------------------");

    const answers = await createAppWizard();

    const result = await scaffoldProject(answers);

    await showSummaryReport(result);

    process.exit(0);
  } catch (err) {
    logError("\n❌ Error:", err.message);
    process.exit(1);
  }
}

main();

