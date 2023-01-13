import {
  type NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hdvideoSignIn(params: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://hdvideo.one/attendance.php',
    tokens: params
  });
}
