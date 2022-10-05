import cron from 'node-cron';
import { logger } from './utils/logger.js';
import { taskConfigs } from './configs.js';

import TaskHdareaSignIn from './tasks/hdarea-signin.js';
import TaskHaidanSignIn from './tasks/haidan-signin.js';
import TaskGainBoundSignIn from './tasks/gainbound-signin.js';
import TaskHdvideoSignIn from './tasks/hdvideo-signin.js';
import TaskNeteaseSignIn from './tasks/netease-music-signin.js';
import TaskHealthCheck from './tasks/health-check.js';

interface Runner {
  name: string;
  schedule: string;
  task: () => any;
}

export const runners: Runner[] = [
  {
    name: 'hdarea-signin',
    schedule: '30 0 * * *',
    task: () => TaskHdareaSignIn(taskConfigs.hdarea)
  },
  {
    name: 'haidan-signin',
    schedule: '30 0 * * *',
    task: () => TaskHaidanSignIn(taskConfigs.haidan)
  },
  {
    name: 'netease-music-signin',
    schedule: '15 0 * * *',
    task: () => TaskNeteaseSignIn(taskConfigs.netease_music)
  },
  {
    name: 'health-check',
    schedule: '0 1/* * * *',
    task: () => TaskHealthCheck()
  },
  {
    name: 'gainbound-signin',
    schedule: '30 0 * * *',
    task: () => TaskGainBoundSignIn(taskConfigs.gainbound)
  },
  {
    name: 'hdvideo-signin',
    schedule: '30 0 * * *',
    task: () => TaskHdvideoSignIn(taskConfigs.hdvideo)
  }
];

async function runTask(runner: Runner) {
  try {
    logger.info(`[${runner.name}] start.`);
    await runner.task();
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
