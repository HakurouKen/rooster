import {
  NexusPhpSignInTokens,
  RequestContext,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function oldtoonsSignIn(
  context: RequestContext<NexusPhpSignInTokens>
) {
  const { params: tokens, logger } = context;
  return signInNexusPhpSite({
    logger,
    params: {
      signInUrl: 'https://oldtoons.world/attendance.php',
      tokens
    }
  });
}
