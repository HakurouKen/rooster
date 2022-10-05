import { createLogger } from '@/utils/logger.js';

const logger = createLogger('health-check');
export default function healthCheck() {
  logger.info('done');
}
