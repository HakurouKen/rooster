import {
  type NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function oldtoonsSignIn(params: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://oldtoons.world/attendance.php',
    tokens: params
  });
}
