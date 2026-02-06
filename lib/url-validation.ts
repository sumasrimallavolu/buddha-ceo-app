/**
 * URL validation and metadata utilities for external media links
 */

export interface UrlValidationResult {
  isValid: boolean;
  type?: 'image' | 'video' | 'unknown';
  error?: string;
  metadata?: {
    url: string;
    thumbnail?: string;
    title?: string;
    provider?: string;
  };
}

/**
 * Common image file extensions and patterns
 */
const IMAGE_PATTERNS = [
  /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i,
  /image\//i,
];

/**
 * Common video URL patterns
 */
const VIDEO_PATTERNS = {
  youtube: [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^/?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^/?]+)/i,
  ],
  vimeo: [
    /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/i,
    /(?:https?:\/\/)?player\.vimeo\.com\/video\/(\d+)/i,
  ],
  direct: [
    /\.(mp4|webm|mov|avi|mkv|flv|wmv)(\?.*)?$/i,
    /video\//i,
  ],
};

/**
 * Validate if a string is a properly formatted URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Check if URL is an image
 */
export function isImageUrl(url: string): boolean {
  return IMAGE_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * Check if URL is a video
 */
export function isVideoUrl(url: string): boolean {
  return Object.values(VIDEO_PATTERNS).some(patterns =>
    patterns.some(pattern => pattern.test(url))
  );
}

/**
 * Detect media type from URL
 */
export function detectMediaType(url: string): 'image' | 'video' | 'unknown' {
  if (isImageUrl(url)) return 'image';
  if (isVideoUrl(url)) return 'video';
  return 'unknown';
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYouTubeId(url: string): string | null {
  for (const pattern of VIDEO_PATTERNS.youtube) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Extract Vimeo video ID from URL
 */
export function extractVimeoId(url: string): string | null {
  for (const pattern of VIDEO_PATTERNS.vimeo) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Get YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'max' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    max: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Get Vimeo thumbnail URL (requires API - returns placeholder)
 */
export function getVimeoThumbnail(videoId: string): string {
  // Note: Getting actual Vimeo thumbnail requires their API
  // This returns a placeholder - you may want to implement API fetching
  return `https://vumbnail.com/${videoId}.jpg`;
}

/**
 * Validate media URL and extract metadata
 */
export async function validateMediaUrl(url: string, expectedType?: 'image' | 'video'): Promise<UrlValidationResult> {
  // Basic URL validation
  if (!isValidUrl(url)) {
    return {
      isValid: false,
      error: 'Invalid URL format. Please enter a valid URL (e.g., https://example.com/image.jpg)',
    };
  }

  // Detect media type
  const detectedType = detectMediaType(url);

  // Check if type matches expectation
  if (expectedType && detectedType !== expectedType) {
    return {
      isValid: false,
      error: `Expected ${expectedType} URL, but got ${detectedType}`,
    };
  }

  // Unknown type
  if (detectedType === 'unknown') {
    return {
      isValid: false,
      error: 'Could not detect media type. Please use a direct link to an image or video file.',
    };
  }

  // Extract metadata based on type
  let metadata: any = { url };

  if (detectedType === 'video') {
    const youtubeId = extractYouTubeId(url);
    const vimeoId = extractVimeoId(url);

    if (youtubeId) {
      metadata = {
        url,
        type: 'youtube',
        videoId: youtubeId,
        thumbnail: getYouTubeThumbnail(youtubeId),
        provider: 'YouTube',
      };
    } else if (vimeoId) {
      metadata = {
        url,
        type: 'vimeo',
        videoId: vimeoId,
        thumbnail: getVimeoThumbnail(vimeoId),
        provider: 'Vimeo',
      };
    } else {
      metadata = {
        url,
        type: 'direct',
        provider: 'Direct Video',
      };
    }
  }

  return {
    isValid: true,
    type: detectedType,
    metadata,
  };
}

/**
 * Fetch image from URL to check if it's accessible
 * Note: This requires CORS to be configured properly on the server
 */
export async function checkImageUrlAccessible(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') ?? false;
  } catch {
    // If fetch fails due to CORS, we can't verify but URL might still work
    return true;
  }
}

/**
 * Get embed URL for video providers
 */
export function getVideoEmbedUrl(url: string): string {
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  const vimeoId = extractVimeoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  return url;
}

/**
 * Format URL for display (shorten if too long)
 */
export function formatUrlForDisplay(url: string, maxLength = 50): string {
  if (url.length <= maxLength) return url;
  return `${url.substring(0, maxLength)}...`;
}
