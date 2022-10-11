import path from 'path';
import { pino } from 'pino';

export function createLogger(
  name: string,
  options: { debug: boolean; logPath: string }
) {
  return pino(
    { name, level: options.debug ? 'debug' : 'info' },
    pino.destination(path.join(options.logPath, `${name}.log`))
  );
}

export type { Logger } from 'pino';
