import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import fetch from 'node-fetch';
import filenamify from 'filenamify';
import { type RequestContext, type Logger } from '@/utils/request-helpers';

async function download(folder: string, logger: Logger) {
  try {
    const rawResponse = await fetch(
      'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&pid=hp&hud=1&hudwidth=3840&hudheight=2160'
    );
    const response: any = await rawResponse.json();
    const image = response.images[0];
    const filename = filenamify(`${image.enddate} - ${image.copyright}.jpg`, {
      replacement: '',
      maxLength: 255
    });
    const imageUrl = new URL(image.url, 'https://cn.bing.com').href;
    logger.info(`Save "${imageUrl}" as "${filename}"`);
    const r = await fetch(imageUrl);
    const b = await r.arrayBuffer()!;

    await writeFile(path.resolve(folder, filename), Buffer.from(b), {
      encoding: null
    });
  } catch (e) {
    logger.error(e);
  }
}

export default async function bingWallpaperDailyDownload(
  context: RequestContext<{
    downloadPath: string;
  }>
) {
  const { params, logger } = context;
  const { downloadPath } = params;

  await download(downloadPath, logger);
}
