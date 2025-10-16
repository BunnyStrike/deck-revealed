# Deck Revealed - Electron Integration

This project is a Next.js 15 + Electron application for the Deck Revealed tool. The application provides a desktop experience for the Deck Revealed web app, with added native capabilities.

## Project Structure

- **Next.js 15**: The web application framework
- **React 19**: UI library
- **Electron 29**: Desktop application wrapper
- **electron-store**: Persistent storage for Electron

## Development

### Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run electron-dev
# or
yarn electron-dev
# or
pnpm electron-dev
```

This will start both Next.js development server and the Electron app.

### Building for Production

```bash
npm run electron-build
# or
yarn electron-build
# or
pnpm electron-build
```

This will generate a production build in the `dist` directory.

## Electron Features

- **Persistent Storage**: Uses electron-store for persistent data storage on the user's device
- **Native OS Integration**: Access to platform-specific features

## Project Architecture

### Key Files

- `main.js`: Electron main process
- `preload.js`: Secure bridge between Electron and renderer processes
- `hooks/useElectron.ts`: React hook for accessing Electron APIs
- `lib/isElectron.ts`: Utility to detect Electron environment
- `components/ElectronInfo.tsx`: Example component using Electron-specific features

### Communication Pattern

The application follows a secure pattern for communication between the Electron main process and the Next.js renderer process:

1. **Preload Script**: Exposes limited APIs from Electron to the renderer
2. **Context Bridge**: Provides a secure channel for IPC communication
3. **React Hooks**: Abstract Electron functionality for React components

## Database Schema

This project does not currently use a database. It utilizes electron-store for local data persistence.

## Future Enhancements

- Add auto-update functionality
- Implement custom window controls
- Add system tray integration
- Enable offline functionality 