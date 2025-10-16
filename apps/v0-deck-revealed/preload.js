const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    store: {
      get: (key) => ipcRenderer.invoke('get-store-value', key),
      set: (key, value) => ipcRenderer.invoke('set-store-value', key, value)
    },
    
    // Add any other APIs you need to expose here
    platform: process.platform
  }
); 