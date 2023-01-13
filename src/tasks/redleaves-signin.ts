import {
  type NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function redleavesSignIn(params: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://leaves.red/attendance.php',
    tokens: params
  });
}
