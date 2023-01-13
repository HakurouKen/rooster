import { logger } from './utils/logger.js';
import { taskConfigs } from './configs.js';

import TaskHdareaSignIn from './tasks/hdarea-signin.js';
import TaskHaidanSignIn from './tasks/haidan-signin.js';
import TaskHdvideoSignIn from './tasks/hdvideo-signin.js';
import TaskHdtimeSignIn from './tasks/hdtime-signin.js';
import TaskPttimeSignIn from './tasks/pttime-signin.js';
import TaskOldtoonsSignIn from './tasks/oldtoons-signin.js';
import TaskRedleavesSignIn from './tasks/redleaves-signin.js';
import TaskWintersakuraSignIn from './tasks/wintersakura-signin.js';
import TaskNeteaseSignIn from './tasks/netease-music-signin.js';

type Task = {
  name: string;
  description?: string;
  task: (params: any) => void;
};

export const tasks: Task[] = [
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
    name: 'hdvideo-signin',
    description: 'HDVIDEO PT 签到',
    task: TaskHdvideoSignIn
  },
  {
    name: 'hdtime-signin',
    description: 'HDTime 签到',
    task: TaskHdtimeSignIn
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
    name: 'wintersakura-signin',
    description: '冬樱 PT 签到',
    task: TaskWintersakuraSignIn
  }
];

export async function run(taskName: string | Task) {
  const task =
    typeof taskName === 'string'
      ? tasks.find((t) => t.name === taskName)
      : taskName;

  if (!task) {
    throw new Error(`Task "${task}" not found.`);
  }

  try {
    logger.info(`[${task.name}] start.`);
    await task.task(taskConfigs[task.name]);
    logger.info(`[${task.name}] end.`);
  } catch (e) {
    logger.error(`[${task.name}] failed: ${e}`);
  }
}

export function runAll() {
  logger.info(`punch start running...`);
  return tasks.map(async (task) => await run(task));
}
