import {
  type NexusPhpCheckInTokens,
  checkInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hdareaCheckIn(params: NexusPhpCheckInTokens) {
  return checkInNexusPhpSite({
    checkInUrl: 'https://www.hdarea.co/sign_in.php',
    tokens: params,
    method: 'post',
    body: 'action=sign_in'
  });
}
