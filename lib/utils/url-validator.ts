/**
 * URL Validation Utility
 * Checks if video URLs are accessible and valid
 */

const VALIDATION_TIMEOUT = 3000; // 3 seconds
const MAX_CONCURRENT_CHECKS = 5;

export interface ValidationResult {
  url: string;
  isValid: boolean;
  error?: string;
  responseTime?: number;
}

/**
 * Check if a URL is accessible with HEAD request
 */
async function checkUrlAccessibility(url: string): Promise<ValidationResult> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), VALIDATION_TIMEOUT);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': new URL(url).origin,
      },
    });

    clearTimeout(timeoutId);

    return {
      url,
      isValid: response.ok || response.status === 403, // Some sources block HEAD but work with GET
      responseTime: Date.now() - startTime,
      error: !response.ok && response.status !== 403 ? `HTTP ${response.status}` : undefined,
    };
  } catch (error) {
    return {
      url,
      isValid: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

/**
 * Validate multiple URLs in batches
 */
export async function validateUrls(urls: string[]): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  
  // Process in batches to avoid overwhelming the network
  for (let i = 0; i < urls.length; i += MAX_CONCURRENT_CHECKS) {
    const batch = urls.slice(i, i + MAX_CONCURRENT_CHECKS);
    const batchResults = await Promise.all(
      batch.map(url => checkUrlAccessibility(url))
    );
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Quick validation - just checks if URL format is valid
 */
export function isValidUrlFormat(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Check if URL is likely a video URL
 */
export function isLikelyVideoUrl(url: string): boolean {
  if (!isValidUrlFormat(url)) return false;
  
  const videoExtensions = ['.m3u8', '.mp4', '.flv', '.avi', '.mkv', '.ts'];
  const lowerUrl = url.toLowerCase();
  
  return videoExtensions.some(ext => lowerUrl.includes(ext));
}

/**
 * Validate a single episode source
 */
export async function validateEpisodeSource(
  episodeName: string,
  url: string
): Promise<{ name: string; url: string; isValid: boolean; error?: string }> {
  if (!isValidUrlFormat(url)) {
    return {
      name: episodeName,
      url,
      isValid: false,
      error: 'Invalid URL format',
    };
  }

  const result = await checkUrlAccessibility(url);
  
  return {
    name: episodeName,
    url,
    isValid: result.isValid,
    error: result.error,
  };
}

/**
 * Filter out invalid episodes
 */
export async function filterValidEpisodes(
  episodes: Array<{ name: string; url: string; index: number }>
): Promise<Array<{ name: string; url: string; index: number; isValid: boolean }>> {
  // First filter by URL format
  const validFormatEpisodes = episodes.filter(ep => isValidUrlFormat(ep.url));
  
  if (validFormatEpisodes.length === 0) {
    return episodes.map(ep => ({ ...ep, isValid: false }));
  }

  // Check accessibility for first 3 episodes as sample
  const samplesToCheck = validFormatEpisodes.slice(0, 3);
  const validationResults = await validateUrls(samplesToCheck.map(ep => ep.url));
  
  // If at least one sample works, assume all with valid format work
  const hasWorkingEpisodes = validationResults.some(r => r.isValid);
  
  return episodes.map(ep => ({
    ...ep,
    isValid: isValidUrlFormat(ep.url) && (hasWorkingEpisodes || ep.url.includes('.m3u8')),
  }));
}
