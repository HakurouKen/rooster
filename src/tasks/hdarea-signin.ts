import {
  NexusPhpSignInTokens,
  signInNexusPhpSite
} from '@/utils/request-helpers';

export default async function signIn(tokens: NexusPhpSignInTokens) {
  return signInNexusPhpSite({
    signInUrl: 'https://www.hdarea.co/sign_in.php',
    tokens
  });
}

