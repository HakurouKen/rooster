import { cosmiconfigSync } from 'cosmiconfig';

const explorer = cosmiconfigSync('punch');

const configResult = explorer.search();

export const configs = configResult?.config;
