const { contextBridge, ipcRenderer } = require('electron');

/**
 * Preload Script
 * 
 * This script runs in the renderer process before the web content loads.
 * It provides a secure bridge between the main process and renderer process.
 * 
 * The contextBridge API allows us to expose specific functions to the renderer
 * without giving it full access to Node.js APIs (security best practice).
 */

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Toggle always-on-top window behavior
   * @returns {Promise<boolean>} New always-on-top state
   */
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
  
  /**
   * Get current always-on-top state
   * @returns {Promise<boolean>} Current always-on-top state
   */
  getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top'),
  
  /**
   * Platform information
   */
  platform: process.platform,
  
  /**
   * Check if running in Electron
   */
  isElectron: true
});

/**
 * Optional: Add keyboard shortcuts listener
 * This allows the React app to listen for global shortcuts
 */
contextBridge.exposeInMainWorld('shortcuts', {
  onGlobalShortcut: (callback) => {
    ipcRenderer.on('global-shortcut', callback);
  }
});