## 🛠 `create-electron-app` CLI Tool — Architecture & Flow (Electron + React + Vite Generator)

### 🔰 CLI OVERVIEW

* CLI Name: `create-electron-app` (global binary installed via `bin/index.js`)
* Tech: Node.js (ESM), `prompts` for prompts, modular scaffold logic
* Run anywhere from terminal: `create-electron-app`
* Generates fully working Electron app (Vite+React+TS) into CWD
* Output folder: `${cwd}/${appName}`

---

## 🧩 PROJECT STRUCTURE GENERATED

```
${cwd}/${appName}/
├── public/ (or sometimes src/)
│   └── index.html                  ← Entrypoint HTML
├── src/
│   ├── main.ts                     ← Electron main process
│   ├── preload.ts (if enabled)    ← Secure preload script
│   ├── App.tsx                     ← React component
│   └── main.tsx                   ← React/Vite root entry
├── .eslintrc.js / .prettierrc     ← If ESLint/Prettier enabled
├── package.json                   ← Scripts & deps
├── tsconfig.json                  ← TypeScript config
├── vite.config.js                 ← Vite setup
├── scripts/init-db.js            ← If SQLite enabled
├── README.md / Agents.md         ← If readme/agents enabled
├── electron-builder.yml          ← For `npm run dist`
```

---

## ✅ SELECTABLE FEATURES (WITH TEMPLATE SUPPORT)

Each feature corresponds to `templates/with-<feature>/`:

* `react` + `typescript`: always included
* `electron`: always included
* `preload`: adds `src/preload.ts`
* `eslint`: `.eslintrc.js`
* `prettier`: `.prettierrc`, `.prettierignore`
* `sqlite`: `sqlite3`, `scripts/init-db.js`
* `sso`: creates login handler for AD/SSO
* `darkmode`: adds `darkmode.js` (auto-enables `preload`)
* `frameless`: custom window controls (auto-enables `preload`)

---

## ⚙️ DEV SCRIPTS IN `package.json`

```json
"scripts": {

  "dev": "cross-env NODE_ENV=development concurrently \"tsc -w\" \"vite --config vite.config.js\" \"electron .\"",
  "build": "vite build && tsc",
  "dist": "electron-builder",
  "clean": "rimraf dist build .cache",
  "lint": "eslint . --ext .ts,.tsx",
  "format": "prettier --write .",
  "reset": "rimraf node_modules && npm install",
  "dbinit": "node scripts/init-db.js",
  "start": "node dist/main.js"
}
```

*The `dev` script relies on `concurrently` and `cross-env` to run `tsc -w`, Vite and Electron in parallel while setting `NODE_ENV`. Include these as development dependencies. The watch mode means TypeScript rebuilds automatically whenever source files change.*

---

## ⚒ CURRENT FILES (CRITICAL PATH)

### 1. `src/main.ts` (Electron Main Process)

```ts
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"), // if enabled
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```

### 2. `src/App.tsx`

```tsx
import React from "react";
export function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Hello from Electron + React + Vite!</h1>
      <p>Your app is running.</p>
    </div>
  );
}
export default App;
```

### 3. `src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
```

### 4. `index.html`

(Place at the project root)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Electron React Vite</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🧠 WHAT WENT WRONG EARLIER

| Issue                         | Cause                                                        | Fix                                                                      |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `preload: ${__dirname}` error | TS doesn't allow template literals                           | Used `path.join(__dirname, "preload.js")`                                |
| HTML parse5 errors            | Double-quoted attributes from PowerShell `@""` heredoc       | Switched to proper HTML escaping                                         |
| `/src/main.tsx` not found     | `index.html` moved to `src/` instead of project root | Place `index.html` in project root |
| `npm run start` fails         | No compiled `dist/main.js`                                  | `npm run build` must succeed and output must match `start` script target |

---

## 🧭 NEXT STEPS

If you're handing this to Claude or another dev:

1. Ensure `create-electron-app` CLI is global (`npm link` or installed via symlink)
2. Run `create-electron-app` and test every selected feature path.
3. `npm run dev` for live mode
4. `npm run build` → generates `dist/main.js`
5. `npm run start` for production mode

If anything breaks, likely reasons:

* Missing or broken templates under `/templates/with-*`
* Vite config misalignment (ensure TS and JSX support)
* Incomplete TypeScript build (`tsc` must emit `dist/main.js`)
* Wrong preload path or missing script

---

## 🗺️ Repository Layout

```
makeapp/
├── bin/               # CLI entrypoint
├── src/               # Wizard, generator, and utilities
├── templates/         # Base and feature templates
├── README.md          # User docs
└── AGENTS.md          # Maintainer notes (this file)
```

Generated apps follow a similar structure under `<appName>/` as detailed above in *Project Structure Generated*.

### Token Replacement Logic

Template files may contain tokens such as `{{APP_NAME}}` or `{{WINDOW_TITLE}}`. The `renderTemplateFiles` utility replaces these tokens in `.js`, `.ts`, `.json`, `.html`, `.md`, `.yml`, and `.yaml` files, while ignoring `node_modules`, `dist`, `build`, and `.git` directories.

### Extending with New Features

1. Add a folder under `templates/with-<feature>` containing the template files.
2. Add an entry in `src/config/featureSets.js` describing the feature.
3. Declare any extra dependencies in `src/generator.js` within `featurePackages`.

The generator will automatically copy the template folder, install declared packages, and inject tokens.

### CLI Flags & Auto-Enabled Features

- `--answers <file>` – Noninteractive mode using a JSON file of wizard answers.
- `--no-prompt` – Fail if prompts would be shown. Must be used with `--answers`.
- Selecting `darkmode` or `frameless` auto-adds the `preload` feature. The summary report denotes this as `preload (auto)`.


