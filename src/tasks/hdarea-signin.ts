import {
  type NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hdareaSignIn(params: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://www.hdarea.co/sign_in.php',
    requestMethod: 'post',
    requestBody: 'action=sign_in',
    tokens: params
  });
}
