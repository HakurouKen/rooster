import * as fs from 'node:fs';

export function getTypeOf(o: any) {
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}

export function ensureDir(filepath: string) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath, { recursive: true });
  }
  const stat = fs.statSync(filepath);
  if (stat.isFile()) {
    throw new Error(`Path ${filepath} must be a folder.`);
  }
}
