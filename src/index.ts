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
      type: 'string',
      default: '~/.punch/'
    });
}

yargs(hideBin(process.argv))
  .command(
    'list',
    '列出所有支持的任务',
    () => {},
    () => {
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
  .command('exec <task>', '执行单个任务', withRunnerOptions, (argv) => {
    run(argv.task as string, {
      verbose: argv.verbose,
      logPath: argv.logPath,
      once: true
    });
  })
  .command(['*', 'run'], '运行监听', withRunnerOptions, (argv) => {
    runAll(argv);
  })
  .demandCommand()
  .help()
  .parse();
