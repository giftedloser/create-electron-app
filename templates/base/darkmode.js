import { nativeTheme, ipcMain, BrowserWindow } from 'electron';

ipcMain.handle('darkmode-get', () => {
  return nativeTheme.shouldUseDarkColors;
});

nativeTheme.on('updated', () => {
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('darkmode-updated', nativeTheme.shouldUseDarkColors);
  });
});
