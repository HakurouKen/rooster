import {
  NexusPhpSignInTokens,
  RequestContext,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function haidanSignIn(
  context: RequestContext<NexusPhpSignInTokens>
) {
  const { params: tokens, logger } = context;

  return signInNexusPhpSite({
    logger,
    params: {
      signInUrl: 'https://www.haidan.video/signin.php',
      requestMethod: 'post',
      tokens
    }
  });
}
