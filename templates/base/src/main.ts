import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
{{DARKMODE_IMPORT}}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMELESS = {{FRAMELESS}};

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    ...(FRAMELESS
      ? {
          frame: false,
          transparent: true,
          backgroundColor: "#00000000",
          titleBarStyle: "hiddenInset",
        }
      : {}),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
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
