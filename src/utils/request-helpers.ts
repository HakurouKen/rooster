import fetch, { Response } from 'node-fetch';
import UserAgent from 'user-agents';
import type { Logger } from '@/utils/logger.js';
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

function normalizeSuccessMatcher(
  matcher: RegExp | ((text: string, r: Response) => boolean | Promise<boolean>)
) {
  if (getTypeOf(matcher) === 'regexp') {
    return async (text: string) => (matcher as RegExp).test(text);
  }
  return matcher as Exclude<typeof matcher, RegExp>;
}

export type RequestContext<T> = {
  logger: Logger;
  params: T;
};

export async function signInNexusPhpSite(
  context: RequestContext<{
    signInUrl: string;
    requestMethod?: string;
    requestBody?: string;
    tokens: NexusPhpSignInTokens;
    successMatcher?:
      | RegExp
      | ((text: string, r: Response) => boolean | Promise<boolean>);
  }>
) {
  const { params, logger } = context;
  const { signInUrl, tokens, successMatcher } = params;

  const ua = new UserAgent({ deviceCategory: 'desktop' });

  const response = await fetch(signInUrl, {
    method: params.requestMethod || 'get',
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
    body: params.requestBody
  });

  logger.debug({ response });

  if (!response.ok) {
    logger.error({ url: signInUrl, status: response.status });
    throw response;
  }

  if (!successMatcher) {
    return response;
  }

  const responseText = await response.clone().text();

  const matched = await normalizeSuccessMatcher(successMatcher)(
    responseText,
    response
  );
  if (!matched) {
    logger.error({ url: signInUrl, status: response.status, responseText });
    throw response;
  }

  logger.info({ url: signInUrl, message: 'success' });
  return response;
}
