import * as path from 'node:path';
import { readFile } from 'node:fs/promises';
import * as esbuild from 'esbuild';

function readJson(file) {
  return readFile(file, 'utf-8').then(JSON.parse);
}

const packageJson = await readJson(path.join(__dirname, '..', 'package.json'));

await esbuild.build({
  bundle: true,
  format: 'esm',
  entryPoints: ['src/index.ts'],
  outfile: 'dist/punch.mjs',
  watch: process.env.DEBUG === '1',
  external: Object.keys(packageJson.dependencies || {}),
  platform: 'node',
  target: 'node14'
});
