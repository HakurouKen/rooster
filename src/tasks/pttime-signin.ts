import {
  type NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function pttimeSignin(params: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://pttime.org/attendance.php',
    tokens: params
  });
}
