#!/usr/bin/env node
// File: bin/index.js

import { createAppWizard } from "../src/wizard.js";
import { scaffoldProject } from "../src/generator.js";
import { showSummaryReport } from "../src/report.js";
import { info, error as logError } from "../src/utils/logger.js";

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
