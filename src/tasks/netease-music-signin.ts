import fetch from 'node-fetch';
import UserAgent from 'user-agents';
import { logger } from '@/utils/logger.js';

enum NeteaseMusicDeviceType {
  MOBILE = 0,
  PC = 1
}

async function signInOnDevice(options: {
  music_u: string;
  deviceType: NeteaseMusicDeviceType;
}) {
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

export default function neteaseMusicSignIn(params: { music_u: string }) {
  const { music_u } = params;
  return Promise.all([
    signInOnDevice({
      music_u,
      deviceType: NeteaseMusicDeviceType.MOBILE
    }),
    signInOnDevice({
      music_u,
      deviceType: NeteaseMusicDeviceType.PC
    })
  ]);
}
