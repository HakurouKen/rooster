import {
  NexusPhpSignInTokens,
  RequestContext,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hdareaSignIn(
  context: RequestContext<NexusPhpSignInTokens>
) {
  const { params: tokens, logger } = context;

  return signInNexusPhpSite({
    logger,
    params: {
      signInUrl: 'https://www.hdarea.co/sign_in.php',
      requestMethod: 'post',
      requestBody: 'action=sign_in',
      tokens
    }
  });
}
