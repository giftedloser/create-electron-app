// File: src/report.js

import path from "path";
import fs from "fs";

export async function showSummaryReport(result) {
  const { outDir, metadata, packageJson } = result;
  console.log("\n✅ Project Created Successfully\n");

  console.log("📁 Output Folder:", outDir);
  console.log("\n📦 Metadata:");
  console.log("  Name:", metadata.appName);
  console.log("  Title:", metadata.title);
  console.log("  Description:", metadata.description);
  console.log("  Author:", metadata.author);
  console.log("  License:", metadata.license);

  console.log("\n🧱 Selected Features:");
  metadata.features.forEach(f => console.log("  -", f));

  console.log("\n🧰 Scripts Included:");
  Object.entries(packageJson.scripts).forEach(([key, val]) => {
    console.log(`  ${key}: ${val}`);
  });

  const readmePath = path.join(outDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# ${metadata.appName}\n\n${metadata.description}\n`);
  }

  console.log("\n📌 Next Steps:");
  console.log(`  cd ${metadata.appName}`);
  console.log("  npm install");
  console.log("  npm run dev");
}
