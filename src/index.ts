#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { run, runAll, tasks } from '@/task-runners.js';
import { loadConfig } from '@/configs.js';

function withConfigOptions(yargs: yargs.Argv) {
  return yargs.positional('config', {
    alias: 'c',
    type: 'string',
    description: '自定义配置文件路径'
  });
}

yargs(hideBin(process.argv))
  .command(
    'list',
    '列出所有支持的任务',
    { short: { type: 'boolean' } },
    (argv) => {
      if (argv.short) {
        console.log(tasks.map((task) => task.name).join('\n'));
        return;
      }

      const messages = tasks.map(
        (task) =>
          `  - ${task.name}${task.description ? `: ${task.description}` : ''}`
      );
      console.log(`\nTasks: \n`);
      console.log(messages.join('\n'));
      console.log('\n');
    }
  )
  .command(
    'exec [tasks...]',
    '执行单个/多个任务',
    (yargs) =>
      withConfigOptions(yargs).positional('tasks', {
        array: true,
        demand: false
      }),
    async (argv) => {
      loadConfig(argv.config);
      const tasks = argv.tasks as string[];
      if (tasks.length) {
        for (const task of tasks) {
          await run(task as string);
        }
      } else {
        runAll();
      }
    }
  )
  .command(
    '*',
    '执行所有任务',
    (yargs) => withConfigOptions(yargs),
    async () => {
      runAll();
    }
  )
  .demandCommand()
  .help()
  .parse();
