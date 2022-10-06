import fetch from 'node-fetch';
import UserAgent from 'user-agents';
import { RequestContext } from '@/utils/request-helpers.js';

enum NeteaseMusicDeviceType {
  MOBILE = 0,
  PC = 1
}

async function neteaseMusicSignIn(
  context: RequestContext<{
    music_u: string;
    deviceType: NeteaseMusicDeviceType;
  }>
) {
  const options = context.params;
  const { logger } = context;
  const { deviceType = NeteaseMusicDeviceType.MOBILE, music_u } = options;
  const ua = new UserAgent({
    deviceCategory:
      deviceType === NeteaseMusicDeviceType.PC ? 'desktop' : 'mobile'
  });
  try {
    const response = await fetch(
      `https://music.163.com/api/point/dailyTask?csrf_token=&type=${deviceType}`,
      {
        headers: {
          Referer: 'https://music.163.com/',
          Cookie: `MUSIC_U=${music_u}`,
          'User-Agent': ua.toString()
        }
      }
    );
    const result = await response.json();
    logger.info({ deviceType, result });
  } catch (error) {
    logger.error({ deviceType, error });
  }
}

export default function (context: RequestContext<{ music_u: string }>) {
  const { logger } = context;
  const { music_u } = context.params;
  return Promise.all([
    neteaseMusicSignIn({
      logger,
      params: { music_u, deviceType: NeteaseMusicDeviceType.MOBILE }
    }),
    neteaseMusicSignIn({
      logger,
      params: { music_u, deviceType: NeteaseMusicDeviceType.PC }
    })
  ]);
}
