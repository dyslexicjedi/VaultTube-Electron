// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Server URL
  getServerUrl: () => ipcRenderer.invoke('get-server-url'),
  setServerUrl: (url) => ipcRenderer.invoke('set-server-url', url),

  // App Settings
  getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
  setAppSettings: (settings) => ipcRenderer.invoke('set-app-settings', settings),

  // File operations
  getVideoPath: () => ipcRenderer.invoke('get-video-path'),
  openVideoFile: (videoId) => ipcRenderer.invoke('open-video-file', videoId),
  openFolder: () => ipcRenderer.invoke('open-folder'),
  openSettings: () => ipcRenderer.invoke('open-settings')
});