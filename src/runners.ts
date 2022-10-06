import cron from 'node-cron';
import { createLogger } from './utils/logger.js';
import { RequestContext } from './utils/request-helpers.js';
import { taskConfigs } from './configs.js';

import TaskHdareaSignIn from './tasks/hdarea-signin.js';
import TaskHaidanSignIn from './tasks/haidan-signin.js';
import TaskGainBoundSignIn from './tasks/gainbound-signin.js';
import TaskHdvideoSignIn from './tasks/hdvideo-signin.js';
import TaskHddolbySignIn from './tasks/hddolby-signin.js';
import TaskNeteaseSignIn from './tasks/netease-music-signin.js';
import TaskHealthCheck from './tasks/health-check.js';

type Runner<T> = {
  name: string;
  schedule: string;
  params?: T;
  task: (request: RequestContext<T>) => void;
};

export const runners: Runner<any>[] = [
  {
    name: 'health-check',
    schedule: '0 1/* * * *',
    task: TaskHealthCheck
  },
  {
    name: 'netease-music-signin',
    schedule: '15 0 * * *',
    params: taskConfigs.netease_music,
    task: TaskNeteaseSignIn
  },
  {
    name: 'hdarea-signin',
    schedule: '30 0 * * *',
    params: taskConfigs.hdarea,
    task: TaskHdareaSignIn
  },
  {
    name: 'haidan-signin',
    schedule: '30 0 * * *',
    params: taskConfigs.haidan,
    task: TaskHaidanSignIn
  },
  {
    name: 'gainbound-signin',
    schedule: '30 0 * * *',
    params: taskConfigs.gainbound,
    task: TaskGainBoundSignIn
  },
  {
    name: 'hdvideo-signin',
    schedule: '30 0 * * *',
    params: taskConfigs.hdvideo,
    task: TaskHdvideoSignIn
  },
  {
    name: 'hddolby-signin',
    schedule: '30 0 * * *',
    params: taskConfigs.hddolby,
    task: TaskHddolbySignIn
  }
];

async function runTask(runner: Runner<any>) {
  const logger = createLogger(runner.name);
  try {
    logger.info(`[${runner.name}] start.`);
    await runner.task({ logger, params: runner.params });
    logger.info(`[${runner.name}] end.`);
  } catch (e) {
    logger.error(`[${runner.name}] failed: ${e}`);
  }
}

export function run(name: string, once?: boolean) {
  const runner = runners.find((runner) => runner.name === name);
  if (!runner) {
    throw new Error(`Runner "${name}" not found.`);
  }
  if (once) {
    return runTask(runner);
  }
  return cron.schedule(runner.schedule, () => runTask(runner));
}

export function runAll() {
  return runners.map((runner) =>
    cron.schedule(runner.schedule, () => runTask(runner))
  );
}
