# create-electron-app

## Overview

`create-electron-app` is a secure, modular CLI scaffolding tool designed to bootstrap modern Electron applications with React and Vite. It streamlines project setup by combining best practices for frontend, backend, and native integration, all configurable through an intuitive interactive wizard.

---

## Features

- **React with Vite** for fast, modern frontend development  
- **TypeScript** strict typing across all layers  
- **Electron main & preload processes** with secure IPC  
- **ESLint & Prettier** configured for code quality and formatting  
- **Git initialization** with initial commit  
- **SQLite support** for local database integration  
- **AD/SSO stub** for enterprise authentication scaffolding  
- **Dark mode support** aligned with native OS theme  
- **Modular feature templates** for scalable codebase customization  
- **Predefined npm scripts** for dev, build, lint, format, packaging, and more  
- **Configurable window options** and auto-updater stub  
- **Auto-generated README.md and roadmap templates**  
- Fully extensible with your own custom templates and features

---

## Installation

Clone and install dependencies:

```bash
git clone <your-repo-url>
cd create-electron-app
npm install
npm link
```

This makes the CLI globally available as `create-electron-app` (or your custom command).

---

## Usage

Run anywhere in your terminal:

```bash
create-electron-app
```

Follow the interactive wizard to configure your project. The prompts now include helpful descriptions and step numbers so you always know where you are:

* Project metadata (name, author, license, description)
* Core features (React, TypeScript, Electron, AD/SSO, SQLite, etc.)
* Dev tooling (ESLint, Prettier, Git hooks)
* Build and packaging scripts
* Advanced options (window size, resizable, dark mode, custom title bar)

---

## Generated Project Structure

After completion, your project folder includes:

* `src/` - Electron main process and frontend sources
* `src/preload.ts` - exposes IPC-safe APIs using an allowlist of channels
* `public/` - Static assets including `index.html`
* `package.json` - with all scripts and dependencies
* `.gitignore` - standard ignores like `node_modules/` and `dist/`
* `.prettierrc` and `.eslintrc` - code style configs
* Modular feature files (e.g., `db.js` for SQLite)
* Config files, README, and roadmap documents

## Adding IPC Channels

`src/preload.ts` contains two arrays, `allowedSendChannels` and `allowedReceiveChannels`, which control which IPC messages the renderer may use. To expose a new channel, add its name to one of these arrays:

```ts
// src/preload.ts
const allowedSendChannels = ['toMain', 'settings:update'];
const allowedReceiveChannels = ['fromMain', 'settings:changed'];
```

This pattern keeps the IPC surface minimal and secure.

---

## Development

* Source code organized under `src/`
* Templates under `templates/` with `base/` and feature-specific folders
* CLI prompts in `src/wizard.js`
* Project scaffolding logic in `src/generator.js`
* Utilities in `src/utils/`

---

## Contributing

Contributions and issues welcome! Please:

* Fork the repo
* Create feature branches
* Submit pull requests with tests and documentation updates
* Adhere to existing code style and lint rules

---

## Roadmap

* Add VS Code workspace support and launch configurations
* Support more database options and authentication methods
* Integrate CI/CD pipeline templates
* Add internationalization and localization support

---

## License

MIT License © Marshall

---

## Contact

For questions or support, open an issue or contact support@example.com
