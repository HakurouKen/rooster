import {
  type NexusPhpCheckInTokens,
  checkInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function wintersakuraCheckIn(params: NexusPhpCheckInTokens) {
  return checkInNexusPhpSite({
    checkInUrl: 'https://wintersakura.net/attendance.php',
    tokens: params
  });
}
