import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

export function getTypeOf(o: any) {
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}

export function readJson(file: string) {
  return readFile(file, 'utf-8').then(JSON.parse);
}

export function readJsonSync(file: string) {
  return JSON.parse(readFileSync(file, 'utf-8'));
}
