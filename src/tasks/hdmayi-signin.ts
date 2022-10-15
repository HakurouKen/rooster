import {
  NexusPhpSignInTokens,
  RequestContext,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hdmayiSignIn(
  context: RequestContext<NexusPhpSignInTokens>
) {
  const { params: tokens, logger } = context;
  return signInNexusPhpSite({
    logger,
    params: {
      signInUrl: 'http://hdmayi.com/attendance.php',
      tokens
    }
  });
}
