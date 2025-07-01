# create-electron-app

Interactive CLI to scaffold modular, secure Electron + React + Vite applications with professional, production-ready defaults.

---

## Overview
`create-electron-app` is a secure, modular CLI that bootstraps modern Electron applications using React and Vite. The interactive wizard guides you through selecting features and scripts so you start with a ready-to-run project.

---

## Requirements
- Node.js 18 or higher
- macOS, Windows, or Linux

---

## Features
- ✅ **React + Vite** – Fast, modern frontend stack
- ✅ **TypeScript** – Type-safe foundation
- ✅ **Electron** – Secure main and preload processes
- ✅ **ESLint & Prettier** – Linting and formatting with config files
- ✅ **Git init** – Pre-configured with an initial commit
- ✅ **Dark mode** – Native OS theme integration (requires Preload)
- ✅ **Frameless window** – Custom window controls (requires Preload)
- ✅ **SQLite** – Optional embedded DB via better-sqlite3
- ✅ **SSO login** – OAuth2 wiring (optional)
- ✅ **electron-builder** – Cross-platform packaging
- ✅ **Scripts** – dev, build, lint, test, format, dbinit, etc.
- ✅ **Extensible** – Modular template system

---

## Installation

### Local Development
```sh
git clone <your-repo-url>
cd create-electron-app
npm install
npm link
```

### Global Install (Post-Publish)
```sh
npm install -g create-electron-app
```

---

## Usage
```sh
create-electron-app my-app
```

### Examples
```sh
create-electron-app my-app --help
create-electron-app my-app --answers ./answers.json --no-prompt
```

---

## CLI Flags
```sh
--help       Show usage
--version    Show version
--answers    Path to JSON answers file
--no-prompt  Noninteractive mode (requires --answers)
```

---

## Wizard Prompts
- Project metadata (name, author, license)
- Base stack (React, TypeScript, Electron)
- Optional features: Preload, Dark Mode, Frameless, SQLite, SSO
- Tooling: ESLint, Prettier
- Packaging: electron-builder

*Note: Selecting Dark Mode or Frameless will auto-enable Preload.*

---

## Generated Structure
```txt
my-app/
├── src/
│   ├── main.ts            # Electron main process
│   ├── renderer.tsx       # React frontend
│   ├── preload.ts         # IPC allowlist bridge (if enabled)
│   └── components/        # Frameless titlebar (if enabled)
├── public/                # Static files
├── dist/                  # Output folder
├── index.html             # Vite entry
├── package.json
├── .gitignore
├── .prettierrc
├── .eslintrc
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Dev Scripts
```sh
npm run dev       # Live reload via Vite + Electron + tsc
npm run build     # Vite + TypeScript
npm run dist      # electron-builder
npm run lint      # Run ESLint
npm run format    # Run Prettier
npm run test      # Run tests
npm run reset     # Clean & reinstall
npm run dbinit    # Init SQLite schema (if enabled)
npm run start     # Run compiled app
```

---

## IPC Controls
```ts
// src/preload.ts
const allowedSendChannels = ['toMain', 'settings:update'];
const allowedReceiveChannels = ['fromMain', 'settings:changed'];
```

---

## Dark Mode API
```ts
const isDark = await window.api.getDarkMode();
window.api.on('darkmode-updated', (isDark) => {
  // update UI
});
```

---

## Environment Variables (SSO)
```
SSO_AUTH_URL
SSO_TOKEN_URL
SSO_CLIENT_ID
SSO_CLIENT_SECRET
SSO_REDIRECT_URI (default: http://localhost:4280/callback)
```

---

## Packaging
```sh
npm run build
npm run dist
```

Uses `electron-builder.yml`. Output appears in `dist/`.

---

## Troubleshooting
- ❌ Dependencies – delete `node_modules` + reinstall
- ❌ Scripts missing – ensure `npm link` or global install
- ❌ Windows path errors – enable long paths, run terminal as Admin

---

## Development
- CLI: `src/wizard.js`
- Scaffolding: `src/generator.js`
- Templates: `templates/`
- Utilities: `src/utils/`

Set `SKIP_INSTALL=1` to skip `npm install` during generation.

---

## Running Tests
```sh
npm install
npm test
```

---

## Contributing
- Fork → feature branch → PR with tests + docs
- Follow existing style/lint rules

---

## Roadmap
- VS Code launch configs
- CI/CD templates
- Multi-database support
- I18n / L10n scaffolding
- GitHub Actions for auto-pack validation

---

## Release Workflow
`.github/workflows/release.yml` removes `node_modules`, runs `npm pack`, and validates contents.

---

## License
MIT © Marshall

---

## Contact
[Open an issue](https://github.com/your-org/create-electron-app/issues) or message `giftedloser` on GitHub
