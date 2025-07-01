export {};

declare global {
  interface Window {
    api?: {
      send: (channel: string, data?: unknown) => void;
      on: (channel: string, listener: (...args: any[]) => void) => void;
    };
  }
}
