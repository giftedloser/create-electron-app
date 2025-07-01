
interface PreloadAPI {
  getDarkMode?: () => Promise<boolean>;
  on: (channel: string, listener: (...args: any[]) => void) => void;
  send: (channel: string, data?: unknown) => void;
  [key: string]: unknown;
}

declare global {
  interface Window {
    api: PreloadAPI;
  }
}
export {};
