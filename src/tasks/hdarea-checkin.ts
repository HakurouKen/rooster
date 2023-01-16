import {
  type NexusPhpCheckInTokens,
  checkInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hdareaCheckIn(params: NexusPhpCheckInTokens) {
  return checkInNexusPhpSite({
    checkInUrl: 'https://www.hdarea.co/sign_in.php',
    requestMethod: 'post',
    requestBody: 'action=sign_in',
    tokens: params
  });
}
