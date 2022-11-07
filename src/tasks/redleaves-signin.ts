import {
  NexusPhpSignInTokens,
  RequestContext,
  signInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function redleavesSignIn(
  context: RequestContext<NexusPhpSignInTokens>
) {
  const { params: tokens, logger } = context;
  return signInNexusPhpSite({
    logger,
    params: {
      signInUrl: 'https://leaves.red/attendance.php',
      tokens
    }
  });
}
