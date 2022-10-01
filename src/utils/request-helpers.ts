import fetch from 'node-fetch';
import UserAgent from 'user-agents';
import { getTypeOf } from './miscs';

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
  tracker_ssl: string;
}

export async function signInNexusPhpSite(options: {
  signInUrl: string;
  tokens: NexusPhpSignInTokens;
  successMatchers?: RegExp | ((r: Response) => boolean | Promise<boolean>);
}) {
  const { tokens, successMatchers = () => true } = options;

  const ua = new UserAgent({ deviceCategory: 'pc' });

  const response = await fetch('https://www.hdarea.co/sign_in.php', {
    method: 'post',
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
    }
  });

  if (!response.ok) {
    throw response;
  }

  if (getTypeOf(successMatchers) === 'regexp') {
    const text = await response.text();
    if (!(successMatchers as RegExp).test(text)) {
      throw response;
    }
  } else if (successMatchers) {
    const matched = await (successMatchers as Function)(response);
    if (!matched) {
      throw response;
    }
  }
}
