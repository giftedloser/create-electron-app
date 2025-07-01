// File: src/utils/render.js

import fs from "fs/promises";
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
  const files = await listAllFiles(dir);
  for (const file of files) {
    const ext = path.extname(file);
    if ([".js", ".ts", ".tsx", ".json", ".html", ".md", ".yml", ".yaml"].includes(ext)) {
      let content = await fs.readFile(file, "utf-8");
      for (const [key, val] of Object.entries(tokens)) {
        const pattern = new RegExp(`{{\s*${key}\s*}}`, "g");
        content = content.replace(pattern, val);
      }
      await fs.writeFile(file, content);
    }
  }
}

async function listAllFiles(dir) {
  let results = [];
  const list = await fs.readdir(dir);
  for (const file of list) {
    if (IGNORE_DIRS.has(file)) {
      continue;
    }

    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);

    if (stat && stat.isDirectory()) {
      const sub = await listAllFiles(fullPath);
      results = results.concat(sub);
    } else {
      results.push(fullPath);
    }
  }
  return results;
}
