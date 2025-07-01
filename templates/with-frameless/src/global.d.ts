import 'react';

export interface WindowControls {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

declare module 'react' {
  interface CSSProperties {
    WebkitAppRegion?: string;
  }
}

declare global {
  interface Window {
    api?: {
      windowControls: WindowControls;
      getDarkMode?: () => Promise<boolean>;
      on: (channel: string, listener: (...args: unknown[]) => void) => void;
      send: (channel: string, data?: unknown) => void;
      [key: string]: any;
    };
  }
}

export {};
