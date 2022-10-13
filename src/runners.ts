import cron from 'node-cron';
import { createLogger } from './utils/logger.js';
import { RequestContext } from './utils/request-helpers.js';
import { configs } from './configs.js';

import TaskHdareaSignIn from './tasks/hdarea-signin.js';
import TaskHaidanSignIn from './tasks/haidan-signin.js';
import TaskGainBoundSignIn from './tasks/gainbound-signin.js';
import TaskHdvideoSignIn from './tasks/hdvideo-signin.js';
import TaskHddolbySignIn from './tasks/hddolby-signin.js';
import TaskNeteaseSignIn from './tasks/netease-music-signin.js';
import TaskHealthCheck from './tasks/health-check.js';
import TaskXkcdDownload from './tasks/xkcd-download.js';
import { ensureDir } from './utils/miscs.js';

type Runner<T> = {
  name: string;
  description?: string;
  schedule: string;
  params?: T;
  task: (request: RequestContext<T>) => void;
};

export const runners: Runner<any>[] = [
  {
    name: 'health-check',
    description: '心跳检查',
    schedule: '0 1/* * * *',
    task: TaskHealthCheck
  },
  {
    name: 'netease-music-signin',
    description: '网易云音乐签到',
    schedule: '15 0 * * *',
    params: configs.netease_music,
    task: TaskNeteaseSignIn
  },
  {
    name: 'hdarea-signin',
    description: 'HDArea PT 签到',
    schedule: '30 0 * * *',
    params: configs.hdarea,
    task: TaskHdareaSignIn
  },
  {
    name: 'haidan-signin',
    description: '海胆 PT 签到',
    schedule: '30 0 * * *',
    params: configs.haidan,
    task: TaskHaidanSignIn
  },
  {
    name: 'gainbound-signin',
    description: 'GainBound PT 签到',
    schedule: '30 0 * * *',
    params: configs.gainbound,
    task: TaskGainBoundSignIn
  },
  {
    name: 'hdvideo-signin',
    description: 'HDVIDEO PT 签到',
    schedule: '30 0 * * *',
    params: configs.hdvideo,
    task: TaskHdvideoSignIn
  },
  {
    name: 'hddolby-signin',
    description: 'HD Dolby PT 签到',
    schedule: '30 0 * * *',
    params: configs.hddolby,
    task: TaskHddolbySignIn
  },
  {
    name: 'xkcd-download',
    description: 'xkcd 漫画下载',
    schedule: '0 6 * * 0',
    params: configs.xkcd,
    task: TaskXkcdDownload
  }
];

interface RunnerOptions {
  verbose?: boolean;
  logPath?: string;
}

async function runTask(runner: Runner<any>, options: RunnerOptions) {
  const { logPath = '~/.punch/', verbose = false } = options;
  ensureDir(logPath);
  const logger = createLogger(runner.name, { logPath, verbose });

  try {
    logger.info(`[${runner.name}] start.`);
    await runner.task({ logger, params: runner.params });
    logger.info(`[${runner.name}] end.`);
  } catch (e) {
    logger.error(`[${runner.name}] failed: ${e}`);
  }
}

export function run(name: string, options: RunnerOptions & { once?: boolean }) {
  const runner = runners.find((runner) => runner.name === name);
  if (!runner) {
    throw new Error(`Runner "${name}" not found.`);
  }
  if (options.once) {
    return runTask(runner, options);
  }
  return cron.schedule(runner.schedule, () => runTask(runner, options));
}

export function runAll(options: RunnerOptions) {
  return runners.map((runner) =>
    cron.schedule(runner.schedule, () => runTask(runner, options))
  );
}
