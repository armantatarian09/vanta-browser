# Security & Privacy Notes

## Threat model
- **Assets:** browsing history, bookmarks, session cookies, stored settings, local filesystem access.
- **Attackers:** malicious websites, compromised extensions (future), local malware, network adversaries on hostile Wi-Fi.
- **Entry points:** webview content, IPC bridge, file-backed storage, downloads, permissions.

## Mitigations (implemented)
1. **Context isolation** and **sandboxing** enabled in Electron.
2. **No Node integration** in renderer.
3. **Permission gating**: deny geolocation, media, notifications by default.
4. **Third-party cookie blocking** via request header stripping.
5. **Telemetry disabled by default** with explicit toggle.
6. **Crash-safe file logging** via append-only logs.

## Stack constraints
- Electron uses Chromium under the hood; deep cookie isolation per-site is limited without custom partitioning.
- Webview-based tabbing means each tab shares a session by default unless partitioned.
- CSP for the shell is enforced, but content inside the webview is controlled by the site.

## Additional recommendations
- Use automatic updates with signed releases.
- Integrate Safe Browsing or custom blocklists.
- Add per-site permission and content settings.
