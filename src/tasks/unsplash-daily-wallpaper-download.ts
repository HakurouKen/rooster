import { existsSync } from 'fs';
import path from 'node:path';
import { writeFile } from 'fs/promises';
import filenamify from 'filenamify';
import fetch from 'node-fetch';
import { type RequestContext, type Logger } from '@/utils/request-helpers';

interface Image {
  id: string;
  create_at: string;
  update_at: string;
  width: number;
  height: number;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
}

const capitalize = (w: string) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`;

async function download(folder: string, logger: Logger) {
  const response = await fetch(
    'https://unsplash.com/napi/topics/wallpapers/photos?page=1&per_page=30'
  );
  const images = (await response.json()) as Image[];
  console.log(images.length);

  for (const image of images) {
    // ignore unsplash+ files
    if (image.urls.raw.startsWith('https://plus.unsplash.com/')) {
      logger.info(`Skip unsplash+: "${image.urls.raw}"`);
      continue;
    }

    const title = capitalize(
      image.description || image.alt_description || 'Untitled'
    ).replace(/([A-Za-z0-9])?\s+([A-Za-z0-9])/g, '$1-$2');

    const filename = filenamify(
      `${title}[${image.width}x${image.height}][${image.id}].jpg`,
      { replacement: '-', maxLength: 255 }
    );

    const destFile = path.join(folder, filename);
    if (existsSync(destFile)) {
      logger.info(`Skip exists file: "${destFile}"`);
      continue;
    }

    logger.info(`Download "${image.urls.raw}" to "${destFile}"`);
    const r = await fetch(image.urls.raw);
    const b = await r.arrayBuffer();
    await writeFile(destFile, Buffer.from(b), { encoding: null });
  }
}

export default function unsplashDailyWallpaperDownload(
  context: RequestContext<{
    downloadPath: string;
  }>
) {
  return download(context.params.downloadPath, context.logger);
}
