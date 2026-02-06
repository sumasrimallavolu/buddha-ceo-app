# Admin Upload System - Fixed and Enhanced

## Overview

The admin upload system has been restructured and enhanced to properly handle **both file uploads and external URLs** for images and videos across all admin forms.

## What Was Fixed

### 1. ImageUpload Component (`components/admin/ImageUpload.tsx`)

**Problem:** The component was trying to upload multiple files using a POST endpoint that only handles single files. This caused uploads to fail silently.

**Solution:**
- Fixed to use PUT endpoint for multiple files (returns `{ uploads: [...] }`)
- Uses POST endpoint for single file uploads (returns single object)
- Added proper error handling for failed uploads
- Added dark mode support

**Key Changes:**
```typescript
// Now correctly routes single vs multiple uploads
const endpoint = acceptedFiles.length === 1 ? '/api/admin/upload' : '/api/admin/upload';
const method = acceptedFiles.length === 1 ? 'POST' : 'PUT';
```

### 2. VideoUpload Component (`components/admin/VideoUpload.tsx`) - NEW

**Features:**
- Dedicated component for video uploads
- Supports MP4, WebM, and MOV formats
- 50MB file size limit (configurable)
- Upload progress indicator
- Visual preview after upload
- Shows file size and URL
- Dark mode support

**Usage:**
```tsx
import { VideoUpload } from '@/components/admin';

<VideoUpload
  video={video}
  onVideoChange={setVideo}
  maxSize={50 * 1024 * 1024} // 50MB
/>
```

**New - URL Input:**
- Paste YouTube, Vimeo, or direct video URLs
- Automatic video type detection
- Thumbnail extraction for YouTube/Vimeo
- Visual indicator for external videos
- Metadata tracking (provider, video ID, thumbnail)

### 3. Upload API Enhancement (`app/api/admin/upload/route.ts`)

**Changes:**
- Added support for video file types (MP4, WebM, MOV)
- Different size limits for images (5MB) vs videos (50MB)
- Improved error messages with specific size limits
- Both POST (single) and PUT (multiple) endpoints handle videos

**Supported Types:**
- Images: JPEG, PNG, WebP, GIF (max 5MB)
- Videos: MP4, WebM, MOV (max 50MB)

### 4. Form Validation (`lib/admin-validation.ts`) - NEW

**Comprehensive validation for:**
- Content forms (all 9 types)
- Event forms
- Resource forms

**Features:**
- Type-specific required fields
- URL format validation
- Clear error messages
- Easy to integrate into existing forms

**Usage:**
```tsx
import { validateContentForm } from '@/lib/admin-validation';

const handleSubmit = () => {
  const validation = validateContentForm(contentType, formData, {
    uploadedImages,
    photoCollageImages,
    richTextContent,
  });

  if (!validation.isValid) {
    setError(validation.errors.join(', '));
    return;
  }
  // ... proceed with submission
};
```

### 5. Form Components (`components/admin/form-components.tsx`) - NEW

**Components:**
- `RequiredLabel`: Label with optional required asterisk
- `FormField`: Wrapper for consistent form field layout
- Built-in tooltip support
- Error message display

### 6. URL Input Support - NEW ✨

**ImageUpload Component:**
- **Tabbed Interface**: Choose between "Upload File" or "From URL"
- **URL Validation**: Validates image URLs and checks accessibility
- **Supported Sources**:
  - Direct image URLs (JPEG, PNG, WebP, GIF)
  - CDN-hosted images (Cloudinary, Imgur, etc.)
  - Any publicly accessible image URL
- **Visual Indicators**: Shows "URL" badge on externally linked images

**VideoUpload Component:**
- **Tabbed Interface**: Choose between "Upload File" or "From URL"
- **Smart Detection**: Automatically detects YouTube, Vimeo, and direct videos
- **Thumbnail Extraction**:
  - YouTube: Auto-fetches thumbnail
  - Vimeo: Uses vumbnail.com service
- **Metadata Tracking**: Stores provider, video ID, and embed URL
- **Preview Features**: Shows thumbnail and provider badge

**URL Validation Utilities (`lib/url-validation.ts`):**
```tsx
import { validateMediaUrl, detectMediaType } from '@/lib/url-validation';

// Validate and get metadata
const validation = await validateMediaUrl(url, 'video');
// Returns: { isValid, type, metadata: { url, thumbnail, provider, videoId } }

// Quick type detection
const type = detectMediaType(url); // 'image' | 'video' | 'unknown'
```

**Supported Video Platforms:**
- **YouTube**: youtube.com, youtu.be, shorts, embed links
- **Vimeo**: vimeo.com, player links
- **Direct**: MP4, WebM, MOV files

**Usage:**
```tsx
import { RequiredLabel, FormField } from '@/components/admin';

<FormField
  label="Title"
  required
  error={errors.title}
  tooltip="Enter a descriptive title for the content"
>
  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
</FormField>
```

## Required Fields by Content Type

| Content Type | Required Fields |
|--------------|-----------------|
| **achievement** | title, description, category, year |
| **team_member** | title, role, bio, image |
| **testimonial** | title, quote, subtitle |
| **service** | title, description |
| **poster** | title, image, description |
| **photo_collage** | title, images (at least 1) |
| **video_content** | title, videoUrl, category, description |
| **book_publication** | title, image, author, description, category |
| **mixed_media** | title, content |

## Migration Guide for Existing Forms

### Step 1: Update Validation

Replace basic validation with comprehensive validation:

```tsx
// OLD
if (!formData.title) {
  setError('Title is required');
  return;
}

// NEW
import { validateContentForm } from '@/lib/admin-validation';

const validation = validateContentForm(contentType, formData, {
  uploadedImages,
  photoCollageImages,
  richTextContent,
});

if (!validation.isValid) {
  setError(validation.errors.join(', '));
  return;
}
```

### Step 2: Add Visual Required Indicators

```tsx
import { RequiredLabel } from '@/components/admin';

// OLD
<Label htmlFor="title">Title</Label>

// NEW
<RequiredLabel htmlFor="title" required>
  Title
</RequiredLabel>
```

### Step 3: Use Video Upload for Videos

```tsx
import { VideoUpload } from '@/components/admin';

// For video content type
{contentType === 'video_content' && (
  <VideoUpload
    video={video}
    onVideoChange={(video) => {
      if (video) {
        setFormData({ ...formData, videoUrl: video.url });
      }
    }}
  />
)}
```

### Step 4: Use URL Input for External Media

Both components now have tabs to switch between file upload and URL input:

**For Images:**
```tsx
<ImageUpload
  images={uploadedImages}
  onImagesChange={setUploadedImages}
  maxImages={20}
/>
// Users can now:
// 1. Drag & drop or click to upload files
// 2. Switch to "From URL" tab and paste image URLs
```

**For Videos:**
```tsx
<VideoUpload
  video={video}
  onVideoChange={setVideo}
/>
// Users can now:
// 1. Upload MP4/WebM/MOV files
// 2. Paste YouTube/Vimeo URLs
// 3. Use direct video file URLs
```

## Testing Checklist

- [ ] Single image upload works
- [ ] Multiple image upload works
- [ ] Image upload shows progress
- [ ] Failed uploads show error messages
- [ ] Video upload works (MP4, WebM, MOV)
- [ ] Video upload shows progress
- [ ] File size validation works
- [ ] Required field validation shows errors
- [ ] Dark mode displays correctly
- [ ] Can remove uploaded images/videos
- [ ] Form submission validates all required fields

## Troubleshooting

**Upload fails silently:**
- Check browser console for errors
- Verify `BLOB_READ_WRITE_TOKEN` is set in environment variables
- Check Vercel Blob storage is configured

**Multiple files not uploading:**
- Ensure you're using the updated ImageUpload component
- Check that PUT endpoint is being used for multiple files

**Video upload fails:**
- Verify video format is supported (MP4, WebM, MOV)
- Check file size is under 50MB
- Ensure upload API includes video types

**Validation not working:**
- Import validation functions from `@/lib/admin-validation`
- Pass all required data (formData + uploadedFiles + etc.)
- Check content type matches expected format

## API Endpoints

### POST /api/admin/upload
Uploads a single file (image or video).

**Request:**
- Method: POST
- Body: FormData with 'file' field
- Auth: Required (admin or content_manager)

**Response:**
```json
{
  "url": "https://blob-url...",
  "filename": "uploaded-file.jpg",
  "size": 123456,
  "type": "image/jpeg"
}
```

### PUT /api/admin/upload
Uploads multiple files (images or videos).

**Request:**
- Method: PUT
- Body: FormData with 'file0', 'file1', 'file2', etc.
- Auth: Required (admin or content_manager)

**Response:**
```json
{
  "uploads": [
    {
      "url": "https://blob-url...",
      "filename": "file1.jpg",
      "size": 123456,
      "type": "image/jpeg",
      "originalName": "photo.jpg"
    },
    {
      "url": "https://blob-url-2...",
      "filename": "file2.jpg",
      "size": 234567,
      "type": "image/jpeg",
      "originalName": "photo2.jpg"
    }
  ]
}
```

## Environment Variables Required

```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

Get this from Vercel Dashboard → Storage → Blobs

## URL Input Feature - NEW ✨

Both ImageUpload and VideoUpload components now support **external URLs** alongside file uploads!

### How It Works

1. **Tabbed Interface**: Users can switch between "Upload File" and "From URL"
2. **Smart Validation**: URLs are validated for correct media type
3. **Automatic Detection**: YouTube, Vimeo, and direct links are auto-detected
4. **Thumbnail Extraction**: Video thumbnails are automatically fetched
5. **Visual Indicators**: External URLs are clearly marked

### Supported Sources

**Images:**
- Direct image URLs (JPEG, PNG, WebP, GIF)
- CDN-hosted images (Cloudinary, Imgur, AWS S3, etc.)
- Unsplash, Pexels, and other stock photo sites
- Any publicly accessible image URL

**Videos:**
- YouTube (youtube.com, youtu.be, shorts)
- Vimeo (vimeo.com)
- Direct video files (MP4, WebM, MOV)

### Quick Example

```tsx
// Users can now:
// 1. Upload files normally (drag & drop)
// 2. OR paste URLs like:
//    - https://images.unsplash.com/photo-1234567890
//    - https://www.youtube.com/watch?v=dQw4w9WgXcQ
//    - https://res.cloudinary.com/demo/image/upload/v123/photo.jpg

<ImageUpload images={images} onImagesChange={setImages} />
<VideoUpload video={video} onVideoChange={setVideo} />
```

**See `docs/URL_INPUT_EXAMPLES.md` for comprehensive URL examples and use cases!**

## Future Enhancements

Potential improvements:
1. Drag and drop reordering of uploaded images
2. Image cropping/editing before upload
3. Video thumbnail extraction from uploaded videos
4. Batch upload from URL
5. Upload to CDN (CloudFlare, AWS S3)
6. Image optimization/compression before upload
7. Upload resume functionality for large files
8. Pinterest-style URL import (pin from any website)
