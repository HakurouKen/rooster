import {
  NexusPhpSignInTokens,
  RequestContext,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function pttimeSignin(
  context: RequestContext<NexusPhpSignInTokens>
) {
  const { params: tokens, logger } = context;
  return signInNexusPhpSite({
    logger,
    params: {
      signInUrl: 'https://pttime.org/attendance.php',
      tokens
    }
  });
}
