const { app, BrowserWindow, ipcMain } = require('electron');
const serve = require('electron-serve');
const path = require('path');
const Store = require('electron-store');

const store = new Store();
const isProd = process.env.NODE_ENV === 'production';

let mainWindow;

// Set up production mode served via electron-serve
const serveURL = serve({
  directory: path.join(__dirname, '.next')
});

// Create the main browser window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // In production, use electron-serve to serve the Next.js app
  if (isProd) {
    serveURL(mainWindow);
  } else {
    // In development, connect to the Next.js dev server
    mainWindow.loadURL('http://localhost:3010');
    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron app is ready
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC communication handlers
ipcMain.handle('get-store-value', (event, key) => {
  return store.get(key);
});

ipcMain.handle('set-store-value', (event, key, value) => {
  store.set(key, value);
  return true;
}); 