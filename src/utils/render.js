// File: src/utils/render.js

import fs from "fs";
import path from "path";

// Directories that should never have template tokens replaced. They contain
// generated output or third-party dependencies which must remain untouched.
const IGNORE_DIRS = new Set(["node_modules", "dist", "build", ".git"]);

/**
 * Replace {{TOKENS}} in all text files recursively.
 * @param {string} dir - Root project folder
 * @param {object} tokens - Key-value pairs to replace
 */
export async function renderTemplateFiles(dir, tokens) {
  const files = listAllFiles(dir);
  for (const file of files) {
    const ext = path.extname(file);
    if ([".js", ".ts", ".json", ".html", ".md"].includes(ext)) {
      let content = fs.readFileSync(file, "utf-8");
      for (const [key, val] of Object.entries(tokens)) {
        const pattern = new RegExp(`{{\s*${key}\s*}}`, "g");
        content = content.replace(pattern, val);
      }
      fs.writeFileSync(file, content);
    }
  }
}

function listAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (IGNORE_DIRS.has(file)) {
        return;
      }
      results = results.concat(listAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}
