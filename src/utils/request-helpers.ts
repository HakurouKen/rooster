import fetch, { Response } from 'node-fetch';
import { Logger } from 'pino';
import UserAgent from 'user-agents';
import { logger } from './logger.js';
import { getTypeOf } from './miscs.js';

export function createCookies(
  o?: Record<string, number | string | undefined | null>
) {
  if (!o) {
    return '';
  }

  return Object.keys(o || {}).reduce((cookie: string, key: string) => {
    const value = o[key as any];
    return value == null ? cookie : `${cookie};${key}=${value}`;
  }, '');
}

/**
 * tokens for NexusPhp
 */
export interface NexusPhpSignInTokens {
  uid: string;
  pass: string;
  login?: string;
  ssl?: string;
  tracker_ssl?: string;
}

function formatSuccessMatcher(
  matcher: RegExp | ((r: Response, text: string) => boolean | Promise<boolean>)
) {
  if (getTypeOf(matcher) === 'regexp') {
    return async (_: any, text: string) => (matcher as RegExp).test(text);
  }
  return matcher as Exclude<typeof matcher, RegExp>;
}

export interface RequestContext {
  logger: Logger;
  params: any;
}

export async function signInNexusPhpSite(options: {
  signInUrl: string;
  requestMethod?: string;
  requestBody?: string;
  tokens: NexusPhpSignInTokens;
  successMatcher?:
    | RegExp
    | ((r: Response, text: string) => boolean | Promise<boolean>);
}) {
  const { signInUrl, tokens, successMatcher = () => true } = options;

  const ua = new UserAgent({ deviceCategory: 'desktop' });

  const response = await fetch(signInUrl, {
    method: options.requestMethod || 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': ua.toString(),
      cookie: createCookies({
        c_secure_uid: tokens.uid,
        c_secure_pass: tokens.pass,
        c_secure_login: tokens.login || 'bm9wZQ%3D%3D',
        c_secure_ssl: tokens.ssl || 'eWVhaA%3D%3D',
        c_secure_tracker_ssl: tokens.tracker_ssl || 'eWVhaA%3D%3D'
      })
    },
    body: options.requestBody || null
  });

  if (!response.ok) {
    logger.error({ url: signInUrl, status: response.status, response });
    throw response;
  }
  const text = await response.text();
  const matched = await formatSuccessMatcher(successMatcher)(response, text);
  if (!matched) {
    logger.error({ url: signInUrl, status: response.status, text, response });
    throw response;
  }

  logger.info({ url: signInUrl, text, response });
  return text;
}
