import { app, BrowserWindow, ipcMain, session } from 'electron';
import path from 'node:path';
import { readStore, writeStore } from './storage';
import { logLine } from './logger';
import { applyPrivacyPolicy, defaultPrivacyPolicy, type PrivacyPolicy } from '@security/privacy';

let privacyPolicy: PrivacyPolicy = defaultPrivacyPolicy;

const isDev = process.env.NODE_ENV === 'development';

const setupPrivacy = () => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    if (privacyPolicy.blockThirdPartyCookies && details.initiator) {
      try {
        const initiatorHost = new URL(details.initiator).hostname;
        const requestHost = new URL(details.url).hostname;
        if (initiatorHost && requestHost && initiatorHost !== requestHost) {
          delete details.requestHeaders.Cookie;
        }
      } catch {
        // If URLs are malformed, fall back to allowing the request.
      }
    }
    callback({ requestHeaders: details.requestHeaders });
  });

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const blockedPermissions = new Set(['media', 'geolocation', 'notifications']);
    if (blockedPermissions.has(permission)) {
      return callback(false);
    }
    return callback(true);
  });
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webviewTag: true
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  return mainWindow;
};

app.whenReady().then(() => {
  setupPrivacy();
  createWindow();
  ipcMain.handle('storage:read', (_event, key: string) => readStore(key));
  ipcMain.handle('storage:write', (_event, key: string, value: string) => writeStore(key, value));
  ipcMain.handle('privacy:set', (_event, payload: PrivacyPolicy) => {
    privacyPolicy = applyPrivacyPolicy(payload);
  });
  ipcMain.handle('log', (_event, level: 'info' | 'warn' | 'error', message: string) =>
    logLine(level, message)
  );
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
