// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const fs = require('fs');

// Initialize store
const store = new Store();

let mainWindow;
let serverUrl = 'http://localhost:5000';

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'VaultTube',
    icon: path.join(__dirname, 'assets/icon.icns')
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('get-server-url', () => serverUrl);
ipcMain.handle('set-server-url', (event, url) => {
  serverUrl = url;
  return true;
});

ipcMain.handle('get-app-settings', () => store.get('settings', {}));
ipcMain.handle('set-app-settings', (event, settings) => {
  store.set('settings', settings);
  return true;
});

ipcMain.handle('get-video-path', () => {
  const vaultDir = process.env.VAULTTUBE_VAULTDIR;
  if (vaultDir && fs.existsSync(vaultDir)) {
    return vaultDir;
  }
  return null;
});

ipcMain.handle('open-video-file', async (event, videoId) => {
  const vaultDir = process.env.VAULTTUBE_VAULTDIR;
  if (!vaultDir) {
    return { success: false, error: 'Vault directory not configured' };
  }

  const videoPath = path.join(vaultDir, videoId + '.mp4');
  if (!fs.existsSync(videoPath)) {
    return { success: false, error: 'Video file not found' };
  }

  try {
    await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Video', extensions: ['mp4', 'webm', 'mov'] }]
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-folder', async () => {
  const vaultDir = process.env.VAULTTUBE_VAULTDIR;
  if (!vaultDir) {
    return { success: false, error: 'Vault directory not configured' };
  }

  try {
    await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      defaultPath: vaultDir
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-settings', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    filters: [{ name: 'Folder', extensions: ['*'] }]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    process.env.VAULTTUBE_VAULTDIR = result.filePaths[0];
    return { success: true, path: result.filePaths[0] };
  }

  return { success: false };
});