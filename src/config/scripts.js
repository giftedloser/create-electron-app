// File: src/config/scripts.js

export const scriptOptions = [
  { title: "npm run dev → Start dev mode (Vite + Electron)", value: "dev", selected: true, description: "Hot reload" },
  { title: "npm run build → Compile TypeScript + bundle", value: "build", selected: true, description: "Production bundle" },
  { title: "npm run dist → Create standalone app (electron-builder)", value: "dist", selected: true, description: "Package installer" },
  { title: "npm run clean → Remove build/dist/cache folders", value: "clean", description: "Clear output" },
  { title: "npm run lint → Run ESLint", value: "lint", selected: true, description: "Check code" },
  { title: "npm run format → Run Prettier", value: "format", selected: true, description: "Format code" },
  { title: "npm run reset → Clean + reinstall deps", value: "reset", description: "Full reinstall" },
  { title: "npm run db:init → Initialize SQLite schema", value: "dbinit", description: "Setup DB" },
  { title: "npm run start → Launch production build", value: "start", description: "Run compiled app" }
];

export const fullScriptMap = {
  dev: "NODE_ENV=development vite --config vite.config.js && NODE_ENV=development electron .",
  build: "tsc && vite build",
  dist: "electron-builder",
  clean: "rimraf dist build .cache",
  lint: "eslint . --ext .ts,.tsx",
  format: "prettier --write .",
  reset: "rimraf node_modules && npm install",
  dbinit: "node scripts/init-db.js",
  start: "node dist/index.js"
};
