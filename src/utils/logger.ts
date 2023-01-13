import { pino } from 'pino';
import { isTruthy } from './miscs';

export function createLogger(options: { verbose?: boolean }) {
  const { verbose = false } = options;
  const level = verbose ? 'debug' : 'info';
  return pino({
    transport: {
      targets: [
        {
          level,
          target: 'pino-pretty',
          options: { destination: 1 as any }
        }
      ]
    }
  });
}

export const logger = createLogger({ verbose: isTruthy(process.env.DEBUG) });
