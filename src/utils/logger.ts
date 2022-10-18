import path from 'path';
import { pino } from 'pino';

export function createLogger(
  name: string,
  options: { verbose?: boolean; logPath: string }
) {
  const { verbose = false, logPath } = options;
  const level = verbose ? 'debug' : 'info';
  return pino({
    transport: {
      targets: [
        {
          level,
          target: 'pino/file',
          options: { destination: path.join(logPath, `${name}.log`) }
        },
        {
          level,
          target: 'pino-pretty',
          options: { destination: 1 as any }
        }
      ]
    }
  });
}

export type { Logger } from 'pino';
