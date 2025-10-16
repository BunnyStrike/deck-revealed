interface ElectronAPI {
  store: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<boolean>;
  };
  platform: string;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
} 