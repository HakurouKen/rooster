import {
  NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function gainboundSignIn(tokens: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://www.hddolby.com/attendance.php',
    requestMethod: 'get',
    tokens
  });
}
