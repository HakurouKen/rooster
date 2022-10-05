import { cosmiconfigSync } from 'cosmiconfig';
import yargs from 'yargs/yargs';

const explorer = cosmiconfigSync('punch');

const configResult = explorer.search();

export const taskConfigs = configResult?.config;

const rawArgv: any = yargs(process.argv.slice(2))
  .option('debug', { type: 'boolean' })
  .option('logPath', { type: 'string' })
  .parse();

export const configs: { logPath: string; debug: boolean } = {
  logPath: rawArgv.logPath || taskConfigs._?.log_path || '~/.punch/',
  debug: rawArgv.debug
};
