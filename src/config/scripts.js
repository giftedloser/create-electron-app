// File: src/config/scripts.js

export const scriptOptions = [
  { title: "npm run dev → Start dev mode (Vite + Electron)", value: "dev", initial: true },
  { title: "npm run build → Compile TypeScript + bundle", value: "build", initial: true },
  { title: "npm run dist → Create standalone app (electron-builder)", value: "dist", initial: true },
  { title: "npm run clean → Remove build/dist/cache folders", value: "clean" },
  { title: "npm run lint → Run ESLint", value: "lint", initial: true },
  { title: "npm run format → Run Prettier", value: "format", initial: true },
  { title: "npm run reset → Clean + reinstall deps", value: "reset" },
  { title: "npm run db:init → Initialize SQLite schema", value: "dbinit" },
  { title: "npm run start → Launch production build", value: "start" }
];

export const fullScriptMap = {
  dev: "vite --config vite.config.js && electron .",
  build: "tsc && vite build",
  dist: "electron-builder",
  clean: "rimraf dist build .cache",
  lint: "eslint . --ext .ts,.tsx",
  format: "prettier --write .",
  reset: "rimraf node_modules && npm install",
  dbinit: "node scripts/init-db.js",
  start: "node dist/index.js"
};
