import {
  type NexusPhpCheckInTokens,
  checkInNexusPhpSite
} from '@/utils/request-helpers.js';

export default async function hdvideoCheckIn(params: NexusPhpCheckInTokens) {
  return checkInNexusPhpSite({
    checkInUrl: 'https://hdvideo.one/attendance.php',
    tokens: params
  });
}
