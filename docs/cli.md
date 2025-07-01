# CLI Documentation

This guide covers advanced usage of `create-electron-app`, including all command-line flags, prompt behavior, automation flows, and the internal generation architecture.

## CLI Flags

- `--answers <file>` – Supply a JSON file containing wizard answers to run non-interactively.
- `--no-prompt` – Abort if the wizard would prompt. Must be combined with `--answers`.
- `--help` – Display usage information.
- `--version` – Print the installed CLI version.

## Interactive Mode Prompts

Running `create-electron-app` without arguments starts an interactive wizard that collects:

1. Project metadata (name, description, author, license, window title)
2. Selected feature flags
3. Desired scripts (dev, build, dist, etc.)
4. Preferred package manager

The wizard automatically enables dependent features. Selecting `darkmode` or `frameless` auto-adds the `preload` feature. The summary report lists such items as `preload (auto)`.

## Feature Dependency Logic

Feature dependencies are resolved before scaffolding. For example, `darkmode` and `frameless` require `preload`. When these features are chosen, the generator inserts `preload` templates and updates configuration files accordingly. The resulting project always includes all required files.

## Output Structure

Generated projects follow this layout:

```
<appName>/
├── src/
│   ├── main.ts
│   ├── preload.ts (optional)
│   ├── App.tsx
│   └── main.tsx
├── public/ or index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron-builder.yml (when `dist` script selected)
└── other feature files
```

Each template file may contain tokens such as `{{APP_NAME}}` or `{{WINDOW_TITLE}}`. The generator replaces these tokens during scaffolding. Files not relevant to selected features are removed.

## Scripting and Automation

Use the `--answers` flag with a JSON file to integrate the CLI into CI/CD pipelines. Combine with `--no-prompt` to ensure the process fails if any prompt would appear. The CLI exits with code `0` on success or a non-zero code when generation fails.

Example CI usage:

```
npx create-electron-app my-app --answers ./ci-answers.json --no-prompt
```

Set `SKIP_INSTALL=1` in the environment to skip dependency installation during automation.

## Exit Codes and Error Handling

- `0` – Project generated successfully
- `1` – Invalid CLI usage or prompt required with `--no-prompt`
- Other non-zero codes – An error occurred during generation. The CLI prints a message describing the failure and cleans up partial output.

## Internal Architecture

`create-electron-app` renders templates from the `templates/` directory. The generator applies token replacement and copies feature overlays based on the selected feature set. Logic lives in `src/generator.js` and `src/config/featureSets.js`.

- **Token Rendering** – `renderTemplateFiles()` replaces tokens in source files while ignoring build artifacts and `node_modules`.
- **File Overlays** – Each feature has a `templates/with-<feature>` folder whose contents are merged into the project directory when the feature is enabled.
- **FeatureSet Interop** – Features can require other features. Dependency rules in `featureSets.js` ensure the final project includes all necessary files and packages.


