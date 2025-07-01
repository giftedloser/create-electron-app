'''create-electron-app/
├── bin/                      # CLI entrypoint
│   └── index.js              # Main executable for `create-electron-app`
│
├── src/                      # CLI logic and utilities
│   ├── wizard.js             # Interactive prompt logic
│   ├── generator.js          # Core scaffolding engine
│   ├── report.js             # CLI summary output
│   ├── utils/                # File, log, and rendering helpers
│   │   ├── fileOps.js
│   │   ├── logger.js
│   │   └── render.js
│   ├── config/               # Feature config definitions
│   │   └── featureSets.js
│   └── scripts/              # Script injection map (npm scripts per feature)
│
├── templates/                # Project templates
│   ├── base/                 # Base template (always included)
│   │   ├── src/
│   │   │   ├── main.ts       # Electron main process
│   │   │   ├── preload.ts    # Preload bridge (if enabled)
│   │   │   ├── renderer.tsx  # React entrypoint
│   │   │   └── global.d.ts   # Global TS declarations
│   │   ├── index.html        # Entry HTML file
│   │   ├── tsconfig.json     # TypeScript config (with allowJs)
│   │   ├── package.json      # Generated template package.json
│   │   └── .eslintrc         # ESLint config (if selected)
│   │
│   ├── with-darkmode/        # Dark mode extension
│   │   └── src/
│   │       └── darkmode.js   # Runtime theme logic
│   │
│   ├── with-sqlite/          # SQLite integration
│   │   └── src/
│   │       └── db.js         # SQLite wrapper
│   │
│   ├── with-preload/         # Optional preload scaffolding
│   ├── with-frameless/       # Frameless window controls
│   │   └── src/components/
│   │       └── WindowControls.tsx
│   │
│   ├── with-sso/             # SSO OAuth2 wiring
│   ├── with-eslint/          # ESLint config
│   ├── with-prettier/        # Prettier config
│   └── with-dist/            # electron-builder config
│
├── test/                     # Node test suite
│   ├── darkmode.test.js
│   ├── build-darkmode.test.js
│   ├── missing-darkmode.test.js
│   ├── import-darkmode.test.js
│   ├── start-darkmode.test.js
│   ├── summary-autopreload.test.js
│   ├── tsc-emission.test.js
│   ├── features.test.js
│   └── ...
│
├── .github/                  # GitHub Actions workflows
│   └── workflows/
│       └── release.yml       # CI release pipeline
│
├── .gitignore
├── CHANGELOG.md
├── README.md
├── AGENTS.md                 # Maintainer-level implementation notes
├── package.json
└── package-lock.json

----


'''my-app/
├── dist/                      # Output folder from build (created after `npm run build`)
│   ├── darkmode.js            # Compiled dark mode script (if enabled)
│   ├── main.js                # Compiled Electron main process
│   ├── preload.js             # Compiled preload script
│   └── index.html             # Copied from project root
├── node_modules/              # Installed dependencies
├── public/                    # Static assets (optional)
├── src/                       # Application source code
│   ├── darkmode.js            # Dark mode runtime hook (if feature enabled)
│   ├── main.ts                # Electron main process
│   ├── preload.ts            # IPC allowlist + bridge
│   ├── renderer.tsx           # Frontend root (Vite entry)
│   ├── global.d.ts            # Shared types (if Preload enabled)
│   └── components/            # React components (e.g., WindowControls.tsx)
│       └── WindowControls.tsx # Custom titlebar buttons (if frameless enabled)
├── .gitignore                 # Standard ignores (node_modules/, dist/, etc.)
├── .eslintrc                  # ESLint config (if enabled)
├── .prettierrc                # Prettier rules (if enabled)
├── .prettierignore            # Prettier ignore patterns
├── electron-builder.yml       # Packaging config (if dist script selected)
├── index.html                 # Main HTML entry for Vite
├── package.json               # Project metadata and scripts
├── tsconfig.json              # TypeScript config (includes JS support if darkmode enabled)
├── vite.config.ts             # Vite build config
└── README.md                  # Scaffolded README



