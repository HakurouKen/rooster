import {
  NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hdareaSignIn(tokens: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://hdvideo.one/attendance.php',
    requestMethod: 'get',
    tokens
  });
}
