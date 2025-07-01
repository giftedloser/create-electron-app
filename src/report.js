// File: src/report.js

import path from "path";
import fs from "fs";
import chalk from "chalk";
import boxen from "boxen";

export async function showSummaryReport(result) {
  const { outDir, metadata, packageJson } = result;

  const featureList = metadata.features
    .map((f) => `- ${f === "preload" && metadata.autoPreload ? "preload (auto)" : f}`)
    .join("\n");
  const scriptList = Object.entries(packageJson.scripts)
    .map(([key, val]) => `${key}: ${val}`)
    .join("\n");

  const summary = `
${chalk.bold.green('Project Created Successfully')}

${chalk.bold('Output Folder')}: ${outDir}

${chalk.underline('Metadata')}
Name: ${metadata.appName}
Title: ${metadata.title}
Description: ${metadata.description}
Author: ${metadata.author}
License: ${metadata.license}

${chalk.underline('Selected Features')}
${featureList}

${chalk.underline('Scripts Included')}
${scriptList}

${chalk.underline('Next Steps')}
cd ${metadata.appName}
npm run dev
`;

  console.log(boxen(summary.trim(), { padding: 1, borderColor: 'green', margin: 1 }));

  const readmePath = path.join(outDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(
      readmePath,
      `# ${metadata.appName}\n\n${metadata.description}\n`
    );
  }
}
