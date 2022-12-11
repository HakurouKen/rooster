import os from 'os';
import path from 'path';
import cron from 'node-cron';
import { createLogger } from './utils/logger.js';
import { RequestContext } from './utils/request-helpers.js';
import { taskConfigs } from './configs.js';
import { ensureDir } from './utils/miscs.js';

import TaskHdareaSignIn from './tasks/hdarea-signin.js';
import TaskHaidanSignIn from './tasks/haidan-signin.js';
import TaskGainBoundSignIn from './tasks/gainbound-signin.js';
import TaskHdvideoSignIn from './tasks/hdvideo-signin.js';
import TaskHddolbySignIn from './tasks/hddolby-signin.js';
import TaskHdtimeSignIn from './tasks/hdtime-signin.js';
import TaskHdmayiSignIn from './tasks/hdmayi-signin.js';
import TaskGgptSignIn from './tasks/ggpt-signin.js';
import TaskPttimeSignIn from './tasks/pttime-signin.js';
import TaskOldtoonsSignIn from './tasks/oldtoons-signin.js';
import TaskNeteaseSignIn from './tasks/netease-music-signin.js';
import TaskRedleavesSignIn from './tasks/redleaves-signin.js';
import TaskHealthCheck from './tasks/health-check.js';
import TaskXkcdDownload from './tasks/xkcd-download.js';

type Runner<T> = {
  name: string;
  description?: string;
  task: (request: RequestContext<T>) => void;
};

export const runners: Runner<any>[] = [
  {
    name: 'health-check',
    description: '心跳检查',
    task: TaskHealthCheck
  },
  {
    name: 'netease-music-signin',
    description: '网易云音乐签到',
    task: TaskNeteaseSignIn
  },
  {
    name: 'hdarea-signin',
    description: 'HDArea PT 签到',
    task: TaskHdareaSignIn
  },
  {
    name: 'haidan-signin',
    description: '海胆 PT 签到',
    task: TaskHaidanSignIn
  },
  {
    name: 'gainbound-signin',
    description: 'GainBound PT 签到',
    task: TaskGainBoundSignIn
  },
  {
    name: 'hdvideo-signin',
    description: 'HDVIDEO PT 签到',
    task: TaskHdvideoSignIn
  },
  {
    name: 'hddolby-signin',
    description: 'HD Dolby PT 签到',
    task: TaskHddolbySignIn
  },
  {
    name: 'hdmayi-signin',
    description: 'HD 蚂蚁签到',
    task: TaskHdmayiSignIn
  },
  {
    name: 'hdtime-signin',
    description: 'HDTime 签到',
    task: TaskHdtimeSignIn
  },
  {
    name: 'ggpt-signin',
    description: 'GGPT 签到',
    task: TaskGgptSignIn
  },
  {
    name: 'pttime-signin',
    description: 'PTT 签到',
    task: TaskPttimeSignIn
  },
  {
    name: 'redleaves-signin',
    description: '红叶 PT 签到',
    task: TaskRedleavesSignIn
  },
  {
    name: 'oldtoons-signin',
    description: 'OldToons PT 签到',
    task: TaskOldtoonsSignIn
  },
  {
    name: 'xkcd-download',
    description: 'xkcd 漫画下载',
    task: TaskXkcdDownload
  }
];

interface RunnerOptions {
  verbose?: boolean;
  logPath?: string;
}

function getLogPath(logPath?: string) {
  return (
    logPath || taskConfigs._?.logPath || path.join(os.homedir(), '.punch/')
  );
}

async function runTask(runner: Runner<any>, options: RunnerOptions) {
  const { verbose = false } = options;
  const logPath = getLogPath(options.logPath);

  ensureDir(path.resolve(logPath));
  const logger = createLogger(runner.name, { logPath, verbose });

  try {
    logger.info(`[${runner.name}] start.`);
    await runner.task({ logger, params: taskConfigs[runner.name]?.config });
    logger.info(`[${runner.name}] end.`);
  } catch (e) {
    logger.error(`[${runner.name}] failed: ${e}`);
  }
}

export function run(
  name: string,
  options: RunnerOptions & { once?: boolean; schedule?: string }
) {
  const runner = runners.find((runner) => runner.name === name);
  if (!runner) {
    throw new Error(`Runner "${name}" not found.`);
  }
  if (options.once || !options.schedule) {
    return runTask(runner, options);
  }
  return cron.schedule(options.schedule, () => runTask(runner, options));
}

export function runAll(options: RunnerOptions) {
  const logPath = getLogPath(options.logPath);
  const logger = createLogger('default', { logPath });
  logger.info(`punch start running...`);
  return runners.map((runner) =>
    cron.schedule(taskConfigs[runner.name].schedule, () =>
      runTask(runner, options)
    )
  );
}
