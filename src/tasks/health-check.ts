import { RequestContext } from '@/utils/request-helpers.js';

export default function healthCheck(context: RequestContext<null>) {
  const { logger } = context;
  logger.info('done');
}
