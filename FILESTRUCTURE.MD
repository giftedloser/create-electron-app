```md
create-electron-app/          # CLI tool source (this repo)
├── bin/
│   └── index.js              # CLI entrypoint (`create-electron-app`)
│
├── src/                      # Core CLI logic
│   ├── wizard.js             # Interactive prompt flow
│   ├── generator.js          # Project scaffolding engine
│   ├── report.js             # Summary output after generation
│   ├── utils/
│   │   ├── fileOps.js        # Filesystem operations
│   │   ├── logger.js         # Colored log wrappers
│   │   └── render.js         # Template rendering
│   ├── config/
│   │   └── featureSets.js    # Feature group definitions
│   └── scripts/              # Feature-specific npm script maps
│
├── templates/                # Project templates (copied into scaffolded apps)
│   ├── base/                 # Always-included base structure
│   │   ├── src/
│   │   │   ├── main.ts       # Electron main process
│   │   │   ├── preload.ts    # Preload script (if enabled)
│   │   │   ├── renderer.tsx  # React app entry
│   │   │   └── global.d.ts   # Type declarations (if preload enabled)
│   │   ├── index.html
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── .eslintrc
│   │
│   ├── with-darkmode/        # Injects darkmode.js
│   │   └── src/darkmode.js
│   ├── with-sqlite/          # SQLite integration
│   │   └── src/db.js
│   ├── with-preload/         # Supplementary preload code
│   ├── with-frameless/
│   │   └── src/components/WindowControls.tsx
│   ├── with-sso/             # OAuth2 login
│   ├── with-eslint/
│   ├── with-prettier/
│   └── with-dist/            # electron-builder config
│
├── test/                     # CLI tests (Node.js-based)
│   ├── darkmode.test.js
│   ├── build-darkmode.test.js
│   ├── summary-autopreload.test.js
│   ├── start-darkmode.test.js
│   └── ...
│
├── .github/
│   └── workflows/release.yml
├── .gitignore
├── CHANGELOG.md
├── README.md
├── AGENTS.md                 # Maintainer/dev documentation
├── package.json
└── package-lock.json


my-app/                       # Project created by the CLI
├── dist/                     # Build output (after `npm run build`)
│   ├── darkmode.js           # Compiled JS (if dark mode enabled)
│   ├── main.js               # Electron main process
│   ├── preload.js            # IPC preload script (if enabled)
│   └── index.html
├── node_modules/
├── public/                   # Optional static assets
├── src/
│   ├── darkmode.js           # Theme logic (if enabled)
│   ├── main.ts               # Electron entry
│   ├── preload.ts            # Secure IPC bridge
│   ├── renderer.tsx          # React frontend entry
│   ├── global.d.ts           # Type declarations (if preload)
│   └── components/
│       └── WindowControls.tsx  # Frameless controls (if enabled)
├── .gitignore
├── .eslintrc                 # Optional ESLint config
├── .prettierrc               # Optional Prettier config
├── .prettierignore
├── electron-builder.yml      # Packaging config (if selected)
├── index.html
├── package.json
├── tsconfig.json             # Includes allowJs if darkmode
├── vite.config.ts
└── README.md
```
