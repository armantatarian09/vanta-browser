# Vanta

Browse faster. Leak less.

## Quick start
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Tests
```bash
npm run test
```

### Lint/format
```bash
npm run lint
npm run format
```

## Repo layout (monorepo)
```
/app       # Electron shell + renderer
/core      # Navigation, tab model, settings
/ui        # Reusable UI components
/storage   # Persistence schemas and keys
/security  # Privacy settings + policies
/tests     # Vitest suites
```

## MVP architecture
- **Electron main process:** window creation, privacy controls, file-backed storage, logging.
- **Renderer:** React UI, tabbed webviews, settings panel.
- **IPC bridge:** preload APIs for storage and privacy controls.

## Privacy baseline
- Third-party cookies blocked by default (best-effort header stripping).
- Telemetry disabled by default.
- Permissions denied by default for geolocation, media, notifications.

See `docs/product-spec.md` and `docs/security-privacy.md` for details.
