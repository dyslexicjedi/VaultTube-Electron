# VaultTube Desktop

A cross-platform desktop application for [VaultTube](https://github.com/dyslexicjedi/VaultTube), built with [Electron](https://www.electronjs.org/). VaultTube Desktop provides a native wrapper that connects to your self-hosted VaultTube server, giving you a dedicated desktop experience on macOS and Linux.

---

## Features

- **Native desktop experience** — runs as a standalone app outside of the browser
- **Configurable server URL** — connect to any self-hosted VaultTube instance
- **Persistent settings** — server URL and app settings are saved locally via `electron-store`
- **Secure IPC bridge** — uses Electron's `contextBridge` to safely expose only the APIs the renderer needs, with `nodeIntegration` disabled

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or later (v24 recommended)
- npm
- A running [VaultTube](https://github.com/dyslexicjedi/VaultTube) server instance

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dyslexicjedi/VaultTube-Electron.git
   cd VaultTube-Electron
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

---

## Usage

### Run in development mode

```bash
npm run dev
```

This launches the app with the Node.js inspector enabled (`--inspect`) for debugging.

### Run normally

```bash
npm start
```

On first launch, the app will display a configuration screen where you can enter the URL of your VaultTube server (default: `http://localhost:5000`). Click **Connect** to load the server interface inside the app.

### Vault directory

To enable local video file access, set the `VAULTTUBE_VAULTDIR` environment variable to the path of your vault folder before launching:

```bash
npm start
```

You can also configure the vault directory at runtime via the in-app settings dialog.

---

## Building

### Quick build (universal)

```bash
bash build.sh
```

### Build for a specific platform

```bash
# macOS (x64 + arm64)
npx electron-builder build --mac --x64 --arm64

# Linux (x64 + arm64)
npx electron-builder build --linux --x64 --arm64
```

Build output is placed in the `dist/` directory.

| Platform | Output formats |
|----------|---------------|
| macOS    | `.dmg`, `.zip` |
| Linux    | `.AppImage`, `.deb`, `.rpm` |

---

## CI / CD

GitHub Actions workflows are included in `.github/workflows/electron.yml` and run automatically on every push or pull request to `main`.

| Trigger | Behaviour |
|---------|-----------|
| Push / PR to `main` | Builds for macOS & Linux and uploads artifacts |
| Push of a `v*` tag | Builds and **publishes a GitHub Release** automatically |

---

## Project Structure

```
VaultTube-Electron/
├── main.js            # Electron main process — window creation & IPC handlers
├── preload.js         # Context bridge — exposes safe APIs to the renderer
├── index.html         # Initial configuration / connection UI
├── stylesheet.css     # Custom styles
├── bootstrap.min.css  # Bootstrap CSS (bundled)
├── bootstrap.bundle.min.js  # Bootstrap JS (bundled)
├── jquery.min.js      # jQuery (bundled)
├── build.sh           # Convenience build script
├── package.json
└── .github/
    └── workflows/
        └── electron.yml  # CI/CD pipeline
```

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Author

**dyslexicjedi** — [rob@dyslexicjedi.com](mailto:rob@dyslexicjedi.com)
