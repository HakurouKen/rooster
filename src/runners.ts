import cron from 'node-cron';
import { logger } from './utils/logger.js';
import { taskConfigs } from './configs.js';

import TaskHdareaSignin from './tasks/hdarea-signin.js';
import TaskHaidanSignIn from './tasks/haidan-signin.js';
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
    task: () =>
      TaskHdareaSignin({
        uid: taskConfigs.HDAREA_UID,
        pass: taskConfigs.HDAREA_PASS,
        login: taskConfigs.HDAREA_LOGIN,
        ssl: taskConfigs.HDAREA_SSL,
        tracker_ssl: taskConfigs.HDAREA_TRACKER_SSL
      })
  },
  {
    name: 'haidan-signin',
    schedule: '30 0 * * *',
    task: () =>
      TaskHaidanSignIn({
        uid: taskConfigs.HAIDAN_UID,
        pass: taskConfigs.HAIDAN_PASS,
        login: taskConfigs.HAIDAN_LOGIN,
        ssl: taskConfigs.HAIDAN_SSL,
        tracker_ssl: taskConfigs.HAIDAN_TRACKER_SSL
      })
  },
  {
    name: 'netease-music-signin',
    schedule: '15 0 * * *',
    task: () =>
      TaskNeteaseSignIn({
        u: taskConfigs.NETEASE_MUSIC_U
      })
  },
  {
    name: 'health-check',
    schedule: '0 1/* * * *',
    task: () => TaskHealthCheck()
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
