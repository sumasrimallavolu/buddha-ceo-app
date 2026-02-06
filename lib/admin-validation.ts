/**
 * Validation utilities for admin forms
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates content form data based on content type
 */
export function validateContentForm(
  type: string,
  data: Record<string, any>,
  additionalData?: {
    uploadedImages?: any[];
    photoCollageImages?: any[];
    richTextContent?: string;
  }
): ValidationResult {
  const errors: string[] = [];

  // Common validation - title is always required
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }

  // Type-specific validation
  switch (type) {
    case 'achievement':
      if (!data.description || data.description.trim() === '') {
        errors.push('Description is required');
      }
      if (!data.category || data.category.trim() === '') {
        errors.push('Category is required');
      }
      if (!data.year || data.year.trim() === '') {
        errors.push('Year is required');
      }
      break;

    case 'team_member':
      if (!data.role || data.role.trim() === '') {
        errors.push('Role is required');
      }
      if (!data.bio || data.bio.trim() === '') {
        errors.push('Bio is required');
      }
      if (!data.image && additionalData?.uploadedImages?.length === 0) {
        errors.push('Photo is required');
      }
      break;

    case 'testimonial':
      if (!data.quote || data.quote.trim() === '') {
        errors.push('Quote is required');
      }
      if (!data.subtitle || data.subtitle.trim() === '') {
        errors.push('Subtitle/Name is required');
      }
      break;

    case 'service':
      if (!data.description || data.description.trim() === '') {
        errors.push('Description is required');
      }
      break;

    case 'poster':
      if (!data.image && additionalData?.uploadedImages?.length === 0) {
        errors.push('Poster image is required');
      }
      if (!data.description || data.description.trim() === '') {
        errors.push('Description is required');
      }
      break;

    case 'photo_collage':
      if (!additionalData?.photoCollageImages || additionalData.photoCollageImages.length === 0) {
        errors.push('At least one photo is required');
      }
      break;

    case 'video_content':
      if (!data.videoUrl || data.videoUrl.trim() === '') {
        errors.push('Video URL is required');
      }
      // Validate video URL format
      if (data.videoUrl && !isValidUrl(data.videoUrl)) {
        errors.push('Video URL must be a valid URL');
      }
      if (!data.category || data.category.trim() === '') {
        errors.push('Category is required');
      }
      if (!data.description || data.description.trim() === '') {
        errors.push('Description is required');
      }
      break;

    case 'book_publication':
      if (!data.image && additionalData?.uploadedImages?.length === 0) {
        errors.push('Cover image is required');
      }
      if (!data.author || data.author.trim() === '') {
        errors.push('Author is required');
      }
      if (!data.description || data.description.trim() === '') {
        errors.push('Description is required');
      }
      if (!data.category || data.category.trim() === '') {
        errors.push('Category is required');
      }
      break;

    case 'mixed_media':
      if (!additionalData?.richTextContent || additionalData.richTextContent.trim() === '') {
        errors.push('Content is required');
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates event form data
 */
export function validateEventForm(data: Record<string, any>): ValidationResult {
  const errors: string[] = [];

  if (!data.title || data.title.trim() === '') {
    errors.push('Event title is required');
  }

  if (!data.startDate || data.startDate.trim() === '') {
    errors.push('Start date is required');
  }

  if (!data.endDate || data.endDate.trim() === '') {
    errors.push('End date is required');
  }

  if (!data.type || data.type.trim() === '') {
    errors.push('Event type is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates resource form data
 */
export function validateResourceForm(data: Record<string, any>, uploadedImages?: any[]): ValidationResult {
  const errors: string[] = [];

  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!data.type || data.type.trim() === '') {
    errors.push('Resource type is required');
  }

  if (!data.description || data.description.trim() === '') {
    errors.push('Description is required');
  }

  if (!data.downloadUrl && uploadedImages?.length === 0) {
    errors.push('Either a download URL or thumbnail image is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Helper function to validate URL format
 */
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Returns required fields for each content type
 */
export function getRequiredFieldsForContentType(type: string): string[] {
  switch (type) {
    case 'achievement':
      return ['title', 'description', 'category', 'year'];
    case 'team_member':
      return ['title', 'role', 'bio', 'image'];
    case 'testimonial':
      return ['title', 'quote', 'subtitle'];
    case 'service':
      return ['title', 'description'];
    case 'poster':
      return ['title', 'image', 'description'];
    case 'photo_collage':
      return ['title', 'images'];
    case 'video_content':
      return ['title', 'videoUrl', 'category', 'description'];
    case 'book_publication':
      return ['title', 'image', 'author', 'description', 'category'];
    case 'mixed_media':
      return ['title', 'content'];
    default:
      return ['title'];
  }
}
