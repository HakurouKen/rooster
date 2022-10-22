#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { run, runAll, runners } from '@/runners.js';

function withRunnerOptions(yargs: yargs.Argv) {
  return yargs
    .positional('verbose', {
      alias: 'v',
      type: 'boolean',
      default: false,
      description: 'verbose'
    })
    .positional('logPath', {
      type: 'string'
    });
}

yargs(hideBin(process.argv))
  .command(
    'list',
    '列出所有支持的任务',
    { short: { type: 'boolean' } },
    (argv) => {
      if (argv.short) {
        console.log(runners.map((runner) => runner.name).join('\n'));
        return;
      }

      const messages = runners.map(
        (runner) =>
          `  - ${runner.name}${
            runner.description ? `: ${runner.description}` : ''
          }`
      );
      console.log(`\nTasks: \n`);
      console.log(messages.join('\n'));
      console.log('\n');
    }
  )
  .command(
    'exec <tasks...>',
    '执行单个/多个任务',
    (yargs) =>
      withRunnerOptions(yargs).positional('tasks', {
        demand: true,
        array: true
      }),
    async (argv) => {
      const tasks = argv.tasks as string[];
      for (const task of tasks) {
        await run(task as string, {
          verbose: argv.verbose,
          logPath: argv.logPath,
          once: true
        });
      }
    }
  )
  .command(['*', 'run'], '运行监听', withRunnerOptions, (argv) => {
    runAll(argv);
  })
  .demandCommand()
  .help()
  .parse();
