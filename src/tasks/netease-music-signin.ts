import { createLogger } from '@/utils/logger.js';
import fetch from 'node-fetch';
import UserAgent from 'user-agents';

enum NeteaseMusicDeviceType {
  MOBILE = 0,
  PC = 1
}

const logger = createLogger('netease-music-signin');

async function neteaseMusicSignIn(options: {
  u: string;
  deviceType: NeteaseMusicDeviceType;
}) {
  const { deviceType = NeteaseMusicDeviceType.MOBILE, u } = options;
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
          Cookie: `MUSIC_U=${u}`,
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

export default function (options: { u: string }) {
  const { u } = options;
  return Promise.all([
    neteaseMusicSignIn({ u, deviceType: NeteaseMusicDeviceType.MOBILE }),
    neteaseMusicSignIn({ u, deviceType: NeteaseMusicDeviceType.PC })
  ]);
}
