import path from 'path';
import { pino, Logger } from 'pino';
import { configs } from '@/configs.js';

export function createLogger(name: string) {
  return pino(
    { name, level: configs.debug ? 'debug' : 'info' },
    pino.destination(path.join(configs.logPath, `${name}.log`))
  );
}

export { Logger };
