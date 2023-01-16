import {
  type NexusPhpCheckInTokens,
  checkInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function carptCheckIn(params: NexusPhpCheckInTokens) {
  return checkInNexusPhpSite({
    checkInUrl: 'https://carpt.net/attendance.php',
    tokens: params
  });
}
