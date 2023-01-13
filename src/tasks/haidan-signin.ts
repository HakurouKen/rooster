import {
  type NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function haidanSignIn(params: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://www.haidan.video/signin.php',
    requestMethod: 'post',
    tokens: params
  });
}
