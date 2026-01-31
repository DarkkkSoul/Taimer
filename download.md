# Taimer Desktop App - Download & Installation Guide

## Overview
This guide explains how to build and distribute the Taimer desktop application for Windows, macOS, and Linux using electron-builder.

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git (for cloning the repository)

## Building the Application

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd taimer

# Install dependencies
npm install
```

### 2. Build Commands

#### Build for Current Platform
```bash
# Build React app and create installer for your current OS
npm run dist
```

#### Build React App Only
```bash
# Just build the React app (outputs to dist/ folder)
npm run react-build
```

#### Build Electron Package Only
```bash
# Create Electron package (requires React app to be built first)
npm run electron-build
```

### 3. Platform-Specific Builds

#### Windows (.exe installer)
```bash
# Build Windows installer (works on Windows or with Wine on Linux/Mac)
npm run dist
```

#### macOS (.dmg file)
```bash
# Build macOS installer (only works on macOS)
npm run dist
```

#### Linux (.AppImage)
```bash
# Build Linux AppImage (works on Linux)
npm run dist
```

## Output Files

After running `npm run dist`, you'll find the installers in the `dist/` folder:

### Windows
- `dist/Taimer - Desktop Timer Setup 1.0.0.exe` - Windows installer
- `dist/win-unpacked/` - Unpacked Windows application

### macOS
- `dist/Taimer - Desktop Timer-1.0.0.dmg` - macOS disk image
- `dist/mac/` - Unpacked macOS application

### Linux
- `dist/Taimer - Desktop Timer-1.0.0.AppImage` - Linux AppImage
- `dist/linux-unpacked/` - Unpacked Linux application

## Installation Instructions

### Windows
1. Download the `.exe` file
2. Double-click to run the installer
3. Follow the installation wizard
4. Launch from Start Menu or Desktop shortcut

### macOS
1. Download the `.dmg` file
2. Double-click to mount the disk image
3. Drag the app to Applications folder
4. Launch from Applications or Launchpad

### Linux
1. Download the `.AppImage` file
2. Make it executable: `chmod +x Taimer*.AppImage`
3. Double-click to run, or run from terminal: `./Taimer*.AppImage`

## App Features
- **Accurate Timer**: Uses timestamp-based calculation to prevent drift
- **Always On Top**: Optional always-on-top mode for productivity
- **Beautiful UI**: Purple gradient theme with smooth animations
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Lightweight**: Small footprint, fast startup

## Troubleshooting

### Build Issues
- **Node.js version**: Ensure you're using Node.js v16 or higher
- **Dependencies**: Run `npm install` to ensure all dependencies are installed
- **Clean build**: Delete `node_modules` and `dist` folders, then reinstall

### Runtime Issues
- **App won't start**: Check if you have the required system dependencies
- **Always on top not working**: This is an OS-level feature that may require permissions

## Development Mode
To run the app in development mode:
```bash
# Start React dev server and Electron
npm run electron-dev
```

## File Structure
```
taimer/
├── src/                    # React source code
├── dist/                   # Built React app (after npm run react-build)
├── build/                  # Icon files for electron-builder
├── main.js                 # Electron main process
├── preload.js             # Electron preload script
├── package.json           # Project configuration
└── dist/                  # Final installers (after npm run dist)
```

## Customization

### App Icons
Place your custom icons in the `build/` folder:
- `build/icon.ico` - Windows icon (256x256 or higher)
- `build/icon.icns` - macOS icon (512x512 or higher)
- `build/icon.png` - Linux icon (512x512 or higher)

### App Information
Edit `package.json` to customize:
- `name` - Internal app name
- `productName` - Display name
- `description` - App description
- `author` - Your name
- `version` - App version

## Security Notes
- The app uses secure Electron practices with context isolation
- No Node.js integration in renderer process
- IPC communication through secure preload script
- No auto-updater (manual updates only)

## Support
For issues or questions, please check the project repository or create an issue.