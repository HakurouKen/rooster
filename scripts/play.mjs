import * as esbuild from 'esbuild';
import chalk from 'chalk';

await esbuild.build({
  bundle: true,
  format: 'esm',
  entryPoints: ['playground/index.ts'],
  watch: {
    onRebuild(error) {
      if (error) {
        console.error(chalk.red('[play] rebuild failed:'), error);
      } else {
        console.log(chalk.green('[play] rebuild success.'));
      }
    }
  },
  outfile: 'dist/play.mjs',
  platform: 'node',
  target: 'node14'
});

console.log(chalk.green('[play] start watching...'));
