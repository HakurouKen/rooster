import * as fs from 'node:fs';
import { isPlainObject } from 'is-plain-object';

export function getTypeOf(o: any) {
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}

export function ensureDir(filepath: string) {
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath, { recursive: true });
  }
  const stat = fs.statSync(filepath);
  if (stat.isFile()) {
    throw new Error(`Path ${filepath} must be a folder.`);
  }
}

export function isTruthy(s?: string | null) {
  return !s && !['', '0', 'false'].includes(s as any);
}

const LEADING_UNDERSCORE_REGEXP = /^_+/g;
const SNAKECASE_PAIR = /_+[A-Za-z0-9]/g;

export function snakeToCamel(str: string) {
  const leadingUnderscore =
    (String(str || '').match(LEADING_UNDERSCORE_REGEXP) || [])[0] || '';

  return (
    leadingUnderscore +
    String(str || '')
      .replace(LEADING_UNDERSCORE_REGEXP, '')
      .replace(SNAKECASE_PAIR, (m) => {
        return m[m.length - 1].toUpperCase();
      })
  );
}

const LEADING_CAPITAL_WORD = /^[A-Z]+/;
const CAMELCASE_PAIR = /\.?([A-Z]+)/g;

export function camelToSnake(str: string) {
  return String(str || '')
    .replace(LEADING_CAPITAL_WORD, (m) => {
      return m.toLowerCase();
    })
    .replace(CAMELCASE_PAIR, (_, c) => {
      return `_${c.toLowerCase()}`;
    });
}

function deepConvert(convertor: (s: string) => string) {
  return function f(obj: any): any {
    if (isPlainObject(obj)) {
      return Object.keys(obj).reduce((output: any, key) => {
        output[convertor(key)] = f(obj[key]);
        return output;
      }, {});
    }

    if (Array.isArray(obj)) {
      return obj.map(f);
    }

    return obj;
  };
}

export const transformToCamelCase = deepConvert(snakeToCamel);
export const transformToSnakeCase = deepConvert(camelToSnake);
