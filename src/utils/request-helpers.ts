import fetch, { Response } from 'node-fetch';
import UserAgent from 'user-agents';
import { logger } from './logger.js';
import { getTypeOf } from './miscs.js';

export function createCookies(
  o?: Record<string, number | string | undefined | null>
) {
  if (!o) {
    return '';
  }

  return Object.keys(o || {})
    .map((key) => {
      const value = o[key as any];
      return value == null ? null : `${key}=${value}`;
    })
    .filter((p) => p)
    .join(';');
}

/**
 * tokens for NexusPhp
 */
export interface NexusPhpCheckInTokens {
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

export async function checkInNexusPhpSite(options: {
  checkInUrl: string;
  requestMethod?: string;
  requestBody?: string;
  headers?: Record<string, string>;
  tokens: NexusPhpCheckInTokens;
  successMatcher?:
    | RegExp
    | ((text: string, r: Response) => boolean | Promise<boolean>);
}) {
  const {
    checkInUrl,
    tokens,
    requestMethod,
    successMatcher = () => true
  } = options;

  const ua = new UserAgent({ deviceCategory: 'desktop' });

  const requestOptions = {
    method: requestMethod || 'get',
    headers: {
      'user-agent': ua.toString(),
      cookie: createCookies({
        c_secure_uid: tokens.uid,
        c_secure_pass: tokens.pass,
        c_secure_login: tokens.login || 'bm9wZQ%3D%3D',
        c_secure_ssl: tokens.ssl || 'eWVhaA%3D%3D',
        c_secure_tracker_ssl: tokens.tracker_ssl || 'eWVhaA%3D%3D'
      }),
      ...(requestMethod === 'post'
        ? { 'content-type': 'application/x-www-form-urlencoded' }
        : {}),
      ...(options.headers || {})
    },
    body: options.requestBody
  };

  logger.info({ url: checkInUrl, requestOptions });

  const response = await fetch(checkInUrl, requestOptions);

  logger.debug({ response });

  if (!response.ok) {
    logger.error({ url: checkInUrl, status: response.status });
    throw response;
  }

  const responseText = await response.clone().text();

  const matched = await normalizeSuccessMatcher(successMatcher)(
    responseText,
    response
  );
  if (!matched) {
    logger.error({ url: checkInUrl, status: response.status, responseText });
    throw response;
  }

  logger.info({ url: checkInUrl, message: 'success' });
  return response;
}
