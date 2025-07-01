# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
- Support YAML/YML token replacement in templates.
- Locked core features (React, TypeScript, Electron) so they cannot be deselected.
- Resolved npm audit issues by pinning eslint and related plugins.
- Added frameless window option with custom window controls.
- Added Node-based test suite for CLI and rendering utilities.
- Added cross-env dev script and Node >=18 engine requirement.
- Added MIT license and improved documentation.
- Removed redundant Prettier config file.

## [1.0.0] - 2025-06-30
- Initial release of `create-electron-app` CLI.
- Added React, Vite, and TypeScript templates.
- Implemented modular features: preload scripts, ESLint, Prettier, SQLite, SSO, and dark mode.
- Provided secure IPC allowlist and basic logger.
- Included electron-builder packaging and cleanup utilities.
- Improved interactive prompts and gradient banner.
