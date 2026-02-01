import { app } from 'electron';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const logDir = () => path.join(app.getPath('userData'), 'logs');
const logFile = () => path.join(logDir(), 'vanta.log');

export const logLine = async (level: 'info' | 'warn' | 'error', message: string) => {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}\n`;
  await mkdir(logDir(), { recursive: true });
  await appendFile(logFile(), line, 'utf-8');
};
