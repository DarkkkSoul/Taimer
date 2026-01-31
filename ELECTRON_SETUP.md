# Electron Desktop App Setup Guide

## Overview

This guide explains how to convert your React timer application into a desktop app using Electron. The setup maintains clean separation between React (UI/business logic) and Electron (OS-level features).

## Electron Architecture

### Main Process vs Renderer Process

**Main Process (`main.js`)**:
- Controls application lifecycle
- Creates and manages windows
- Handles OS-level features (always-on-top, system tray, etc.)
- Runs in Node.js environment

**Renderer Process (React App)**:
- Runs your React application
- Handles UI and business logic
- Runs in Chromium browser environment
- Communicates with main process via IPC

**Preload Script (`preload.js`)**:
- Secure bridge between main and renderer processes
- Exposes specific APIs without full Node.js access
- Maintains security by using contextBridge

## Installation Commands

```bash
# Install Electron and development tools
npm install --save-dev electron concurrently wait-on

# Optional: For building distributable apps
npm install --save-dev electron-builder
```

## File Structure

```
project-root/
├── main.js              # Electron main process
├── preload.js           # IPC bridge (security)
├── package.json         # Updated with Electron scripts
├── src/
│   ├── components/
│   │   ├── Timer.tsx           # Original timer (unchanged)
│   │   └── ElectronControls.tsx # Electron-specific features
│   └── ... (rest of React app)
```

## Scripts Explanation

### package.json Scripts

```json
{
  "main": "main.js",
  "scripts": {
    "electron": "electron .",
    "electron-dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5174 && electron .\"",
    "build-electron": "npm run build && electron .",
    "dist": "npm run build && electron-builder"
  }
}
```

**Script Breakdown**:
- `electron`: Run Electron with built React app
- `electron-dev`: Run React dev server + Electron simultaneously
- `build-electron`: Build React app then run Electron
- `dist`: Build and package for distribution

## How to Run

### Development Mode
```bash
npm run electron-dev
```
This will:
1. Start Vite dev server (React app)
2. Wait for server to be ready
3. Launch Electron window loading from dev server
4. Enable hot reload for React changes

### Production Mode
```bash
npm run build-electron
```
This will:
1. Build React app to `dist/` folder
2. Launch Electron loading from built files

## Key Features Implemented

### 1. Always-On-Top Window
- **Why it works in Electron**: Desktop apps have OS-level window control
- **Why browsers can't do this**: Security restriction prevents websites from staying on top
- **Implementation**: `alwaysOnTop: true` in BrowserWindow options

### 2. Compact Timer Window
```javascript
new BrowserWindow({
  width: 300,           // Compact for timer
  height: 200,          // Small footprint
  resizable: true,      // User can adjust
  alwaysOnTop: true     // Stays visible
})
```

### 3. Security Best Practices
```javascript
webPreferences: {
  contextIsolation: true,    // Isolate contexts
  nodeIntegration: false,    // No Node.js in renderer
  preload: path.join(__dirname, 'preload.js')
}
```

### 4. IPC Communication
**Main Process** exposes functions:
```javascript
ipcMain.handle('toggle-always-on-top', () => {
  const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
  return !isAlwaysOnTop;
});
```

**Preload Script** creates secure bridge:
```javascript
contextBridge.exposeInMainWorld('electronAPI', {
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top')
});
```

**React Component** uses exposed API:
```javascript
const newState = await window.electronAPI.toggleAlwaysOnTop();
```

## Optional Features (Ready to Implement)

### 1. Global Keyboard Shortcuts
Add to `main.js`:
```javascript
const { globalShortcut } = require('electron');

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+Shift+R', () => {
    // Reset timer via IPC
    mainWindow.webContents.send('global-reset');
  });
});
```

### 2. System Tray
```javascript
const { Tray } = require('electron');

let tray = new Tray('icon.png');
tray.setContextMenu(Menu.buildFromTemplate([
  { label: 'Show Timer', click: () => mainWindow.show() },
  { label: 'Quit', click: () => app.quit() }
]));
```

### 3. Frameless Window
```javascript
new BrowserWindow({
  frame: false,          // Remove title bar
  titleBarStyle: 'hidden' // macOS style
})
```

### 4. Window Dragging
Add to React component:
```css
.drag-region {
  -webkit-app-region: drag;
}
```

## Troubleshooting

### Common Issues

**1. "Module not found" errors**
- Ensure `"type": "module"` is removed from package.json
- Electron main process uses CommonJS

**2. "Failed to load URL" in development**
- Check if Vite dev server is running on correct port
- Update `VITE_DEV_URL` environment variable

**3. White screen on startup**
- Add `show: false` to BrowserWindow options
- Use `ready-to-show` event to display window

### Platform-Specific Notes

**Linux**: 
- GTK warnings are normal and don't affect functionality
- Some themes may show parsing errors (cosmetic only)

**macOS**:
- App stays in dock when windows are closed
- Use `app.on('activate')` to handle dock clicks

**Windows**:
- App quits when all windows are closed
- Consider adding system tray for background operation

## Building for Distribution

### Install electron-builder
```bash
npm install --save-dev electron-builder
```

### Add build configuration to package.json
```json
{
  "build": {
    "appId": "com.yourcompany.timer",
    "productName": "Timer App",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "main.js",
      "preload.js",
      "package.json"
    ]
  }
}
```

### Build commands
```bash
npm run dist              # Build for current platform
npx electron-builder     # Same as above
npx electron-builder --publish=never  # Build without publishing
```

## Summary

This setup provides:
- ✅ Desktop app with always-on-top capability
- ✅ Clean separation of React and Electron code
- ✅ Secure IPC communication
- ✅ Development and production workflows
- ✅ Cross-platform compatibility
- ✅ Ready for additional desktop features

The React timer logic remains completely unchanged - Electron only adds desktop capabilities around it.