# create-electron-app

## Overview

`create-electron-app` is a secure, modular CLI that bootstraps modern Electron applications using React and Vite. The interactive wizard guides you through selecting features and scripts so you start with a ready-to-run project.

---

## Requirements

- Node.js **18+** (the CLI exits with an error on older versions)
- macOS, Windows and Linux are supported

---

## Features

- **React with Vite** – fast, modern frontend development
- **TypeScript** – strict typing across all layers
- **Electron** – main & preload processes with secure IPC
- **ESLint & Prettier** – code quality and formatting. Prettier is
  configured via `.prettierrc` with single quotes, semicolons and
  trailing commas.
- **Git initialization** – with an initial commit
- **SQLite** – optional local database integration
- **SSO login** – enterprise authentication via OAuth2
- **Dark mode** – aligns with the native OS theme. Selecting this option automatically enables the **Preload** feature.
- **Frameless window** – custom controls via `src/components/WindowControls.tsx`. Selecting this option automatically enables the **Preload** feature.
- **Packaging** – electron-builder configuration
- **Predefined npm scripts** – dev, build, lint, format, and more
- Fully extensible with custom templates

---

## Installation

### Local development

Ensure you have **Node.js 18 or higher** installed.

Clone the repo and link the CLI:

```bash
git clone <your-repo-url>
cd create-electron-app
npm install
npm link
```

`npm link` makes the command available globally for testing.

### Global install (after publish)

```bash
npm install -g create-electron-app
```

Then run `create-electron-app` from any folder.

---

## Usage

Run the CLI from any folder:

```bash
create-electron-app my-app
```

Example options:

```bash
create-electron-app my-app --help
create-electron-app my-app
```

### CLI flags

Use `--help` to display usage information or `--version` to print the installed version.

```bash
create-electron-app --help
create-electron-app --version
```

Running `create-electron-app` with no arguments starts the interactive wizard.

For automated environments, supply a JSON answers file using `--answers` to skip prompts:

```bash
create-electron-app my-app --answers ./answers.json
```

The CLI aborts if no TTY is available and no answers file is provided.

The wizard walks you through:

- Project metadata (name, author, license, description)
- **Mandatory features** (React, TypeScript, Electron)
- Optional features like Preload, SQLite, SSO and dark mode. Choosing the frameless window or dark mode option will enable Preload automatically.
- Choose your preferred package manager (npm, yarn or pnpm)
- Dev tooling (ESLint, Prettier)
- Packaging scripts
- Window and UI options

---

## Generated Project Structure

After completion, your project folder includes:

* `src/` - Electron main process and frontend sources
* `src/preload.ts` - exposes IPC-safe APIs using an allowlist of channels
* `index.html` - placed at the project root; use `public/` for any other static assets
* `package.json` - with all scripts and dependencies
* `.gitignore` - standard ignores like `node_modules/` and `dist/`
* `.prettierrc` and `.prettierignore` - Prettier rules and ignore
  patterns when the feature is enabled
* `.eslintrc` - linting configuration
* Modular feature files (e.g., `db.js` for SQLite)
* Config files and README

## Dev Scripts

The generated `package.json` includes helpful commands:

```bash
npm run dev     # Start TypeScript, Vite and Electron in watch mode
npm run build   # Vite build then TypeScript compile
npm run dist    # Package installers via electron-builder
npm run lint    # Run ESLint
npm run format  # Run Prettier
npm test        # Run Node.js tests
npm run reset   # Remove node_modules and reinstall
npm run dbinit # Initialize the SQLite database (if included)
npm run start   # Launch the compiled app
```

The `dev` script uses `cross-env` and `concurrently` to spawn `tsc -w`, Vite and
Electron in parallel. Any changes to TypeScript files trigger an incremental
rebuild so your app refreshes immediately.

## Adding IPC Channels

`src/preload.ts` contains two arrays, `allowedSendChannels` and `allowedReceiveChannels`, which control which IPC messages the renderer may use. To expose a new channel, add its name to one of these arrays:

```ts
// src/preload.ts
const allowedSendChannels = ['toMain', 'settings:update'];
const allowedReceiveChannels = ['fromMain', 'settings:changed'];
```

This pattern keeps the IPC surface minimal and secure.

## Dark Mode API

When the dark mode feature is selected, the preload script provides a
`getDarkMode()` method. It returns a promise resolving to `true` when the
operating system is using a dark theme:

```ts
const isDark = await window.api.getDarkMode();
```

Listen for the `darkmode-updated` event to react to changes:

```ts
window.api.on('darkmode-updated', (isDark) => {
  // update UI
});
```

## Environment Variables

The SSO feature relies on several variables:

- `SSO_AUTH_URL` – OAuth2 authorization endpoint
- `SSO_TOKEN_URL` – token exchange endpoint
- `SSO_CLIENT_ID` – application client ID
- `SSO_CLIENT_SECRET` – client secret
- `SSO_REDIRECT_URI` – redirect URL (default `http://localhost:4280/callback`)

---

## Packaging

Packaging is handled by [electron-builder](https://www.electron.build/).

1. Run `npm run build` to generate production files.
2. Execute `npm run dist` to invoke electron-builder.
3. Installers for your OS appear under the `dist/` folder.

The build uses `electron-builder.yml` at the project root to define targets. You
can tweak this file before running the `dist` script.

---

## Troubleshooting

- **Dependency conflicts** – delete `node_modules` and run `npm install`.
- **Windows path issues** – ensure long paths are enabled and run the terminal as Administrator.
- **electron-builder failures** – try clearing the `dist/` folder and check code-sign settings.
- **Scripts not found** – verify you ran `npm link` or installed globally.

---

## Development

* Source code organized under `src/`
* Templates under `templates/` with `base/` and feature-specific folders
* CLI prompts in `src/wizard.js`
* Project scaffolding logic in `src/generator.js`
* Utilities in `src/utils/`
* Set `SKIP_INSTALL=1` to bypass dependency installation during scaffolding

## Running Tests

Run the Node test suite with:

```bash
npm test
```

Before running tests for the first time, install all project dependencies:

```bash
npm install
```

The tests live in the `test/` directory and require **Node.js 18+**, as noted above.


---

## Contributing

Contributions and issues welcome! Please:

* Fork the repo
* Create feature branches
* Submit pull requests with tests and documentation updates
* Adhere to existing code style and lint rules
* Run `npm install` once before executing the test suite. The `pretest` script
  will reinstall dependencies unless the `SKIP_SETUP` environment variable is
  set.

---

## Roadmap

* Add VS Code workspace support and launch configurations
* Support more database options and authentication methods
* Integrate CI/CD pipeline templates
* Add internationalization and localization support


## Release Workflow

The GitHub Actions workflow defined in `.github/workflows/release.yml` removes
`node_modules` before running `npm pack`. It then lists the tarball contents so
you can confirm that only the source files and templates are included.


## Changelog

This project maintains a `CHANGELOG.md` following the [Keep a Changelog](https://keepachangelog.com/). When preparing a new release:
1. Add notes about the changes under an `Unreleased` heading.
2. Move those notes to a new version section with the release date.
3. Commit the updated changelog as part of the release PR.

---

## License

MIT License © Marshall

---

## Contact

For questions or support, open an issue or contact giftedloser on github.
