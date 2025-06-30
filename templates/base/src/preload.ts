import { contextBridge, ipcRenderer } from 'electron';

// Expose a very small API for the renderer process.
export const api = {
  send(channel: string, data?: any) {
    ipcRenderer.send(channel, data);
  },
  on(channel: string, listener: (...args: unknown[]) => void) {
    ipcRenderer.on(channel, (_event, ...args) => listener(...args));
  }
};

contextBridge.exposeInMainWorld('api', api);
