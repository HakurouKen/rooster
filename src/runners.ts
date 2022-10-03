import cron from 'node-cron';
import { readJsonSync } from './utils/miscs.js';

import taskHdareaSignin from './tasks/hdarea-signin.js';

interface Runner {
  name: string;
  schedule: string;
  task: () => any;
}

const configs = readJsonSync('configs.private.json');

export const runners: Runner[] = [
  {
    name: 'hdarea-signin',
    schedule: '30 12 * * *',
    task: () =>
      taskHdareaSignin({
        uid: configs.HDAREA_UID,
        pass: configs.HDAREA_PASS,
        login: configs.HDAREA_LOGIN,
        ssl: configs.HDAREA_SSL,
        tracker_ssl: configs.HDAREA_TRACKER_SSL
      })
  }
];

// async function runTask(runner: Runner) {
//   try {
//     await runner.task();
//   } catch (e) {
    
//   }
// }

export function run(name: string, once?: boolean) {
  const runner = runners.find((runner) => runner.name === name);
  if (!runner) {
    throw new Error(`Runner "${name}" not found.`);
  }
  if (once) {
    return runner.task();
  }
  return cron.schedule(runner.schedule, runner.task);
}

export function runAll() {
  return runners.map((runner) => cron.schedule(runner.schedule, runner.task));
}
