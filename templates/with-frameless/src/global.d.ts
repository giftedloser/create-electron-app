export interface WindowControls {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
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
