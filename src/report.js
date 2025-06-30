// File: src/report.js

import path from "path";
import fs from "fs";
import { info } from "./utils/logger.js";

export async function showSummaryReport(result) {
  const { outDir, metadata, packageJson } = result;
  info("\n✅ Project Created Successfully\n");

  info("📁 Output Folder:", outDir);
  info("\n📦 Metadata:");
  info("  Name:", metadata.appName);
  info("  Title:", metadata.title);
  info("  Description:", metadata.description);
  info("  Author:", metadata.author);
  info("  License:", metadata.license);

  info("\n🧱 Selected Features:");
  metadata.features.forEach(f => info("  -", f));

  info("\n🧰 Scripts Included:");
  Object.entries(packageJson.scripts).forEach(([key, val]) => {
    info(`  ${key}: ${val}`);
  });

  const readmePath = path.join(outDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# ${metadata.appName}\n\n${metadata.description}\n`);
  }

  info("\n📌 Next Steps:");
  info(`  cd ${metadata.appName}`);
  info("  npm install");
  info("  npm run dev");
}
