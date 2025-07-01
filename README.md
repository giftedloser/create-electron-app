# create-electron-app

## What is `create-electron-app`?

`create-electron-app` is a CLI scaffolding utility designed for engineering teams and developers to rapidly generate Electron + React + Vite applications with modular, production-grade features.

It enables users to scaffold secure, scalable, and maintainable cross-platform desktop apps using a guided CLI wizard or scripted execution. The generated codebase is cleanly structured and follows enterprise-level standards out of the box.

---

## Capabilities

- ✅ Interactive CLI wizard or fully scripted automation
- ✅ Modular feature toggles (Preload, Frameless, Dark Mode, SQLite, ESLint, etc.)
- ✅ Vite + React frontend with live HMR
- ✅ Electron main process with secure preload bridge (optional)
- ✅ TypeScript-first architecture with allowJs fallback
- ✅ Pre-configured ESLint, Prettier, and packaging (electron-builder)
- ✅ Intelligent feature interop: e.g., Preload auto-included for Dark Mode/Frameless
- ✅ Git init, metadata, and clean dependency graph
- ✅ One-command bootstrap: zero manual steps post-gen

---

## Mandatory Features

- `base`: always included (main, renderer, preload.ts stub, Vite config, etc.)

## Optional Feature Flags

| Feature      | Description                                       |
|--------------|---------------------------------------------------|
| `preload`    | Secure IPC bridge + global API exposure           |
| `darkmode`   | Runtime dark mode theme engine (requires preload) |
| `frameless`  | Custom titlebar and draggable controls            |
| `sqlite`     | Embedded SQLite access via `better-sqlite3`       |
| `eslint`     | Linter with recommended rules                     |
| `prettier`   | Formatter with opinionated defaults               |
| `dist`       | electron-builder config for packaging             |

---

## CLI Syntax Summary

```sh
npm create electron-app@latest
npx create-electron-app
create-electron-app (after global install)
```

For advanced usage, see [CLI Documentation](./docs/cli.md)

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
