/**
 * Source Availability Checker
 * Pre-validates video sources during search to filter out unavailable ones
 */

import { isValidUrlFormat } from './url-validator';

const CHECK_TIMEOUT = 3000; // 3 seconds per check
const MAX_RETRIES = 2;

export interface SourceCheckResult {
  sourceId: string;
  sourceName: string;
  isAvailable: boolean;
  sampleUrl?: string;
  error?: string;
  checkedAt: number;
}

/**
 * Check if a single video URL is accessible
 */
async function checkVideoUrl(url: string, retries = MAX_RETRIES): Promise<boolean> {
  if (!isValidUrlFormat(url)) {
    return false;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': new URL(url).origin,
        },
      });

      clearTimeout(timeoutId);

      // Consider 200, 206, and even 403 as "available" 
      // (some sources block HEAD but work with actual playback)
      if (response.ok || response.status === 206 || response.status === 403) {
        return true;
      }
    } catch (error) {
      // If last attempt, return false
      if (attempt === retries) {
        console.error(`Failed to check URL after ${retries + 1} attempts:`, error);
        return false;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return false;
}

/**
 * Extract first playable URL from video data
 */
function extractFirstVideoUrl(video: any): string | null {
  if (!video.vod_play_url) return null;

  try {
    // Format: "Episode1$url1#Episode2$url2#..."
    const episodes = video.vod_play_url.split('#');
    
    for (const episode of episodes) {
      const [, url] = episode.split('$');
      if (url && isValidUrlFormat(url)) {
        return url;
      }
    }
  } catch (error) {
    console.error('Failed to extract video URL:', error);
  }

  return null;
}

/**
 * Check if a source is available by testing a sample video
 */
export async function checkSourceAvailability(
  sourceId: string,
  sourceName: string,
  sampleVideos: any[]
): Promise<SourceCheckResult> {
  const startTime = Date.now();

  // If no videos from this source, mark as unavailable
  if (!sampleVideos || sampleVideos.length === 0) {
    return {
      sourceId,
      sourceName,
      isAvailable: false,
      error: 'No videos found',
      checkedAt: Date.now(),
    };
  }

  // Try to find a video with a valid URL
  for (const video of sampleVideos.slice(0, 3)) { // Check up to 3 videos
    const videoUrl = extractFirstVideoUrl(video);
    
    if (!videoUrl) continue;

    console.log(`Checking source ${sourceName} with URL:`, videoUrl.substring(0, 50) + '...');

    const isAvailable = await checkVideoUrl(videoUrl);

    if (isAvailable) {
      console.log(`✅ Source ${sourceName} is AVAILABLE (checked in ${Date.now() - startTime}ms)`);
      return {
        sourceId,
        sourceName,
        isAvailable: true,
        sampleUrl: videoUrl,
        checkedAt: Date.now(),
      };
    }
  }

  console.log(`❌ Source ${sourceName} is UNAVAILABLE (checked in ${Date.now() - startTime}ms)`);
  return {
    sourceId,
    sourceName,
    isAvailable: false,
    error: 'All sample videos failed to load',
    checkedAt: Date.now(),
  };
}

/**
 * Check multiple sources in parallel
 */
export async function checkMultipleSources(
  sourcesWithVideos: Array<{ sourceId: string; sourceName: string; videos: any[] }>
): Promise<SourceCheckResult[]> {
  const checkPromises = sourcesWithVideos.map(({ sourceId, sourceName, videos }) =>
    checkSourceAvailability(sourceId, sourceName, videos)
  );

  return Promise.all(checkPromises);
}

/**
 * Filter search results to only include videos from available sources
 */
export function filterByAvailableSources(
  videos: any[],
  availableSources: SourceCheckResult[]
): any[] {
  const availableSourceIds = new Set(
    availableSources
      .filter(s => s.isAvailable)
      .map(s => s.sourceId)
  );

  return videos.filter(video => availableSourceIds.has(video.source));
}
