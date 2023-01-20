#!/usr/bin/env zx
import 'zx/globals';
import * as path from 'node:path';
import * as esbuild from 'esbuild';

const packageJson = await fs.readJson(
  path.join(__dirname, '..', 'package.json')
);

await esbuild.build({
  bundle: true,
  format: 'esm',
  entryPoints: ['src/index.ts'],
  outfile: 'dist/rooster.mjs',
  watch: process.env.DEBUG === '1',
  external: Object.keys(packageJson.dependencies || {}),
  platform: 'node',
  target: 'node14'
});
