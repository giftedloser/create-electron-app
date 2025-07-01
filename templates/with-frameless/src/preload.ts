import { contextBridge, ipcRenderer } from 'electron';

// Secure IPC API
const allowedSendChannels = ['toMain'];
const allowedReceiveChannels = ['fromMain'];

const api = {
  send(channel: string, data?: unknown) {
    if (allowedSendChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on(channel: string, listener: (...args: unknown[]) => void) {
    if (allowedReceiveChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => listener(...args));
    }
  },
};

// Frameless window controls
const windowControls = {
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
};

// Single contextBridge exposure. Renderer access: window.api.windowControls
contextBridge.exposeInMainWorld('api', {
  ...api,
  windowControls,
});
