import('./dist/main.js').catch((err) => {
  console.error('Failed to launch Electron main process:', err);
  process.exit(1);
});
