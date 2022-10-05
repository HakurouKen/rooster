import { runAll } from '@/runners.js';

try {
  runAll();
} catch (e) {
  console.error(e);
  process.exit(1);
}
