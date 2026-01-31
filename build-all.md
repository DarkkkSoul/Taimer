# Cross-Platform Build Guide

## Building for All Platforms

### Option 1: Build on Each Platform (Recommended)
For the best compatibility, build on each target platform:

#### On Windows:
```bash
npm run dist
# Creates: Taimer - Desktop Timer Setup 1.0.0.exe
```

#### On macOS:
```bash
npm run dist  
# Creates: Taimer - Desktop Timer-1.0.0.dmg
```

#### On Linux:
```bash
npm run dist
# Creates: Taimer - Desktop Timer-1.0.0.AppImage
```

### Option 2: Cross-Platform Building (Advanced)

You can build for multiple platforms from a single machine, but this requires additional setup:

#### Build All Platforms from Linux/macOS:
```bash
# Install wine for Windows builds (Linux only)
sudo apt install wine

# Build for all platforms
npm run electron-build -- --win --mac --linux
```

#### Build Specific Platforms:
```bash
# Windows only
npm run electron-build -- --win

# macOS only (requires macOS or special setup)
npm run electron-build -- --mac

# Linux only
npm run electron-build -- --linux
```

## File Sizes (Approximate)
- **Windows .exe**: ~120MB
- **macOS .dmg**: ~125MB  
- **Linux .AppImage**: ~115MB

## Distribution Checklist

### Before Building:
- [ ] Update version in `package.json`
- [ ] Add custom app icons to `build/` folder
- [ ] Test the app in development mode
- [ ] Update app description and author info

### After Building:
- [ ] Test the installer on target platform
- [ ] Verify app launches correctly
- [ ] Check all features work (timer, always-on-top)
- [ ] Test installation and uninstallation

### For Release:
- [ ] Create release notes
- [ ] Upload installers to distribution platform
- [ ] Update download links in documentation
- [ ] Test download and installation process

## Troubleshooting Cross-Platform Builds

### Windows Builds on Linux/macOS:
- Install Wine: `sudo apt install wine` (Linux)
- May require additional Windows dependencies

### macOS Builds on Non-Mac:
- Requires macOS or special Docker setup
- Apple Developer account may be needed for signing
- Consider building on macOS for best results

### Code Signing (Optional):
For production releases, consider code signing:
- **Windows**: Requires code signing certificate
- **macOS**: Requires Apple Developer account
- **Linux**: AppImage doesn't require signing

## Automated Builds (CI/CD)
For automated builds, consider:
- GitHub Actions with multiple OS runners
- Electron Forge for simplified setup
- Automated testing before building