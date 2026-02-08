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
    case 'photos':
      // Photos require either an image URL or an uploaded image
      if (!data.imageUrl && additionalData?.uploadedImages?.length === 0) {
        errors.push('Image is required');
      }
      if (!data.category || data.category.trim() === '') {
        errors.push('Category is required');
      }
      break;

    case 'mentors':
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

    case 'founders':
    case 'steering_committee':
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

    default:
      errors.push(`Invalid content type: ${type}`);
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
export function validateResourceForm(data: Record<string, any>, uploadedImages?: any[], richTextContent?: string): ValidationResult {
  const errors: string[] = [];

  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!data.type || data.type.trim() === '') {
    errors.push('Resource type is required');
  }

  // Type-specific validation
  switch (data.type) {
    case 'book':
      if (!data.author || data.author.trim() === '') {
        errors.push('Author is required for books');
      }
      break;

    case 'video':
      if (!data.videoUrl || data.videoUrl.trim() === '') {
        errors.push('Video URL is required');
      } else if (!isValidUrl(data.videoUrl)) {
        errors.push('Video URL must be valid');
      }
      break;

    case 'magazine':
      if (!richTextContent || richTextContent.trim() === '') {
        errors.push('Magazine content is required');
      }
      break;

    case 'link':
      if (!data.linkUrl || data.linkUrl.trim() === '') {
        errors.push('Link URL is required');
      } else if (!isValidUrl(data.linkUrl)) {
        errors.push('Link URL must be valid');
      }
      break;

    case 'testimonial':
      if (!data.quote || data.quote.trim() === '') {
        errors.push('Quote is required for testimonials');
      }
      if (!data.subtitle || data.subtitle.trim() === '') {
        errors.push('Name/Subtitle is required for testimonials');
      }
      break;
  }

  if (!data.category || data.category.trim() === '') {
    errors.push('Category is required');
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
    case 'photos':
      return ['title', 'imageUrl', 'category'];
    case 'mentors':
      return ['title', 'role', 'bio', 'image'];
    case 'founders':
      return ['title', 'role', 'bio', 'image'];
    case 'steering_committee':
      return ['title', 'role', 'bio', 'image'];
    default:
      return ['title'];
  }
}
