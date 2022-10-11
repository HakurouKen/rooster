import path from 'path';
import { pino } from 'pino';

export function createLogger(
  name: string,
  options: { verbose?: boolean; logPath: string }
) {
  const { verbose = false, logPath } = options;
  return pino(
    { name, level: verbose ? 'debug' : 'info' },
    pino.destination(path.join(logPath, `${name}.log`))
  );
}

export type { Logger } from 'pino';
