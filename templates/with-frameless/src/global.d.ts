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
      [key: string]: any;
    };
  }
}

export {};
