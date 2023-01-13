import { cosmiconfigSync } from 'cosmiconfig';

const explorer = cosmiconfigSync('punch');

const defaultTaskConfigs = explorer.search()?.config;

let userTaskConfigs: any = null;

export function loadConfig(configPath?: string) {
  if (!configPath) {
    return;
  }
  userTaskConfigs = explorer.load(configPath)?.config;
}

export const taskConfigs = new Proxy(defaultTaskConfigs, {
  get(target, p) {
    return userTaskConfigs?.[p] || target?.[p];
  }
});
