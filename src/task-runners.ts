import { logger } from './utils/logger.js';
import { taskConfigs } from './configs.js';

import TaskHdareaCheckIn from './tasks/hdarea-checkin.js';
import TaskHaidanCheckIn from './tasks/haidan-checkin.js';
import TaskHdvideoCheckIn from './tasks/hdvideo-checkin.js';
import TaskHdtimeCheckIn from './tasks/hdtime-checkin.js';
import TaskPttimeCheckIn from './tasks/pttime-checkin.js';
import TaskOldtoonsCheckIn from './tasks/oldtoons-checkin.js';
import TaskRedleavesCheckIn from './tasks/redleaves-checkin.js';
import TaskNeteaseCheckIn from './tasks/netease-music-checkin.js';

type Task = {
  name: string;
  description?: string;
  task: (params: any) => void;
};

export const tasks: Task[] = [
  {
    name: 'netease-music-checkin',
    description: '网易云音乐签到',
    task: TaskNeteaseCheckIn
  },
  {
    name: 'hdarea-checkin',
    description: 'HDArea PT 签到',
    task: TaskHdareaCheckIn
  },
  {
    name: 'haidan-checkin',
    description: '海胆 PT 签到',
    task: TaskHaidanCheckIn
  },
  {
    name: 'hdvideo-checkin',
    description: 'HDVIDEO PT 签到',
    task: TaskHdvideoCheckIn
  },
  {
    name: 'hdtime-checkin',
    description: 'HDTime 签到',
    task: TaskHdtimeCheckIn
  },
  {
    name: 'pttime-checkin',
    description: 'PTT 签到',
    task: TaskPttimeCheckIn
  },
  {
    name: 'redleaves-checkin',
    description: '红叶 PT 签到',
    task: TaskRedleavesCheckIn
  },
  {
    name: 'oldtoons-checkin',
    description: 'OldToons PT 签到',
    task: TaskOldtoonsCheckIn
  }
];

function findTask(taskName: string | Task) {
  if (typeof taskName === 'string') {
    const task = tasks.find((t) => t.name === taskName);
    if (!task) {
      throw new Error(`Task "${taskName}" not found.`);
    }
    return task;
  }
  return taskName;
}

export async function run(taskName: string | Task) {
  const task = findTask(taskName);

  try {
    logger.info(`[${task.name}] start.`);
    await task.task(taskConfigs[task.name]);
    logger.info(`[${task.name}] end.`);
  } catch (e) {
    logger.error(`[${task.name}] failed: ${e}`);
  }
}

export async function runAll() {
  logger.info(`rooster start running...`);
  for (const task of tasks) {
    await run(task);
  }
}
