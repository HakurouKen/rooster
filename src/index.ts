import yargs from 'yargs/yargs';
import { run } from '@/runners.js';

const argv = yargs(process.argv.slice(2)).parse() as {
  [k: string]: unknown;
  _: (string | number)[];
  $0: string;
};

try {
  run(String(argv._[0]), true);
} catch (e) {
  console.error(e);
  process.exit(1);
}
