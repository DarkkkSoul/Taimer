const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

/**
 * Electron Main Process
 * 
 * This file handles the main Electron process which manages:
 * - Application lifecycle (startup, shutdown)
 * - Window creation and management
 * - OS-level features (always on top, system integration)
 * 
 * The React app runs in the renderer process and handles all timer logic.
 * This maintains clean separation of concerns.
 */

// Keep a global reference of the window object
let mainWindow;

/**
 * Creates the main application window
 * Configured for timer app with always-on-top behavior
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 200,
    minWidth: 200,
    minHeight: 120,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  });

  // 👇 REMOVE DEFAULT MENU
  Menu.setApplicationMenu(null);

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5174');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * App Event Handlers
 * Handle application lifecycle events
 */

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * IPC Handlers for Optional Features
 * These allow the React app to communicate with the main process
 */

// Toggle always-on-top behavior
ipcMain.handle('toggle-always-on-top', () => {
  if (mainWindow) {
    const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
    return !isAlwaysOnTop;
  }
  return false;
});

// Get current always-on-top state
ipcMain.handle('get-always-on-top', () => {
  return mainWindow ? mainWindow.isAlwaysOnTop() : false;
});

/**
 * Security: Prevent new window creation
 * This prevents malicious websites from opening new windows
 */
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});