import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('vanta', {
  readStore: (key: string) => ipcRenderer.invoke('storage:read', key),
  writeStore: (key: string, value: string) => ipcRenderer.invoke('storage:write', key, value),
  log: (level: 'info' | 'warn' | 'error', message: string) => ipcRenderer.invoke('log', level, message),
  setPrivacy: (payload: { blockThirdPartyCookies: boolean }) =>
    ipcRenderer.invoke('privacy:set', payload)
});
