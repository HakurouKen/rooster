import {
  NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hdareaSignIn(tokens: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://www.hdarea.co/sign_in.php',
    tokens
  });
}
