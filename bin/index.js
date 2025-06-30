#!/usr/bin/env node

import { createAppWizard } from "../src/wizard.js";
import { scaffoldProject } from "../src/generator.js";
import { showSummaryReport } from "../src/report.js";

(async () => {
  console.clear();
  console.log("\n🛠️  create-my-electron-app CLI\n-----------------------------");

  try {
    const answers = await createAppWizard();
    const result = await scaffoldProject(answers);
    await showSummaryReport(result);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
