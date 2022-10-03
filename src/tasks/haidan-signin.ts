import {
  NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function haidanSignIn(tokens: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://www.haidan.video/signin.php',
    tokens
  });
}
