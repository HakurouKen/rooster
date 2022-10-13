import fs from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import UserAgent from 'user-agents';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { RequestContext } from '@/utils/request-helpers';

const ua = new UserAgent({ deviceCategory: 'desktop' });

async function download(
  options: { downloadPath: string; index: number },
  logger: RequestContext<any>['logger']
) {
  const { index, downloadPath } = options;
  const response = await fetch(`https://xkcd.com/${index}/`, {
    headers: {
      'user-agent': ua.toString()
    }
  });
  const text = await response.text();
  const $ = cheerio.load(text);

  logger.debug(text);

  const title = $('#ctitle').text().trim();
  const nextPageUrl = $('a[rel="next"]').attr('href');
  const hasNext = nextPageUrl !== '#';

  const rawImageUrl = $('#comic img').attr('src');
  if (!rawImageUrl) {
    return { index, title, image: null, filename: null, nextPageUrl, hasNext };
  }
  const image = new URL(rawImageUrl, 'https://xkcd.com/').href;
  const rawFilename = rawImageUrl?.split('/').pop()!;
  const filename = `${String(index).padStart(4, '0')} - ${rawFilename}`;

  logger.info({ title, image, filename, nextPageUrl, hasNext });

  const r = await fetch(image);
  const b = await r.arrayBuffer()!;

  logger.info(`Downloading ${filename}`);

  await writeFile(path.resolve(downloadPath, filename), Buffer.from(b), {
    encoding: null
  });

  logger.info(`Downloaded "${filename}".`);

  return {
    index,
    title,
    image,
    filename,
    nextPageUrl,
    hasNext
  };
}

const PROGRESS_FILE = '.xkcd-progress';

export default async function downloadXkcdComic(
  context: RequestContext<{
    downloadPath: string;
    start?: number;
    end?: number;
  }>
) {
  const { params, logger } = context;
  const { downloadPath, start, end = Infinity } = params;

  const progressFilePath = path.resolve(downloadPath, PROGRESS_FILE);
  let from: number;
  if (!start) {
    from = fs.existsSync(progressFilePath)
      ? Number(fs.readFileSync(progressFilePath, 'utf-8'))
      : 1;
  } else {
    from = start;
  }
  const to = end;

  let current = from;
  let hasNext = true;
  while (current < to && hasNext) {
    const result = await download({ downloadPath, index: current }, logger);
    hasNext = result.hasNext;
    fs.writeFileSync(progressFilePath, String(current), 'utf-8');
    current += 1;
  }
}
