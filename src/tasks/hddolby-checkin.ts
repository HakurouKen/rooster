import {
  type NexusPhpCheckInTokens,
  checkInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hddolbyCheckIn(params: NexusPhpCheckInTokens) {
  return checkInNexusPhpSite({
    checkInUrl: 'https://www.hddolby.com/attendance.php',
    tokens: params
  });
}
