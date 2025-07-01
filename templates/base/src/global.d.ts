
declare global {
  interface Window {
    api: {
      getDarkMode?: () => Promise<boolean>;
      on: (channel: string, listener: (...args: unknown[]) => void) => void;
      send: (channel: string, data?: unknown) => void;
      [key: string]: any;
    };
  }
}
export {};
