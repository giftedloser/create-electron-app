// File: bin/index.js

import { createAppWizard } from "../src/wizard.js";
import { scaffoldProject } from "../src/generator.js";
import { showSummaryReport } from "../src/report.js";

async function main() {
  try {
    console.log("🛠️  create-my-electron-app CLI\n-----------------------------");

    const answers = await createAppWizard();

    const result = await scaffoldProject(answers);

    await showSummaryReport(result);

    process.exit(0);
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
}

main();
