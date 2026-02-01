import { app } from 'electron';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dataDir = () => path.join(app.getPath('userData'), 'storage');

const fileForKey = (key: string) => path.join(dataDir(), `${key}.json`);

export const readStore = async (key: string): Promise<string | null> => {
  try {
    const content = await readFile(fileForKey(key), 'utf-8');
    return content;
  } catch {
    return null;
  }
};

export const writeStore = async (key: string, value: string) => {
  await mkdir(dataDir(), { recursive: true });
  await writeFile(fileForKey(key), value, 'utf-8');
};
