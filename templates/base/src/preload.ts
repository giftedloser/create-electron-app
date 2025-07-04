import { contextBridge, ipcRenderer } from 'electron';

// Allowed channels must be explicitly listed. Add new channels here
// to make them accessible from the renderer process.
const allowedSendChannels = ['toMain'];
const allowedReceiveChannels = ['fromMain'];

// Expose a very small API for the renderer process using the allowlists above.
export const api = {
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
  getDarkMode() {
    return ipcRenderer.invoke('darkmode-get');
  },
};

contextBridge.exposeInMainWorld('api', api);
