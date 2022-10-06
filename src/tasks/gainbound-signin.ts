import {
  NexusPhpSignInTokens,
  RequestContext,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function gainboundSignIn(
  context: RequestContext<NexusPhpSignInTokens>
) {
  const { params: tokens, logger } = context;

  return signInNexusPhpSite({
    logger,
    params: {
      signInUrl: 'https://gainbound.net/attendance.php',
      tokens
    }
  });
}
