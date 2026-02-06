# URL Input Examples - Admin Media Upload

## Image URL Examples

### Supported Image URL Formats

### 1. Direct Image Links
```
✅ https://example.com/images/photo.jpg
✅ https://cdn.example.com/image.png
✅ https://example.com/gallery/picture.webp
```

### 2. CDN-Hosted Images
```
✅ Cloudinary: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/photo.jpg
✅ Imgur: https://i.imgur.com/ABC1234.jpg
✅ AWS S3: https://your-bucket.s3.amazonaws.com/image.png
✅ Unsplash: https://images.unsplash.com/photo-1234567890
```

### 3. Content Delivery Networks
```
✅ CloudFlare: https://cdn.example.com/image.jpg
✅ Fastly: https://www.example.com/image.jpeg
✅ Akamai: https://example.com.akamai.net/image.png
```

## Video URL Examples

### 1. YouTube Videos

**Watch Page:**
```
✅ https://www.youtube.com/watch?v=dQw4w9WgXcQ
✅ https://youtube.com/watch?v=dQw4w9WgXcQ
```

**Short URL:**
```
✅ https://youtu.be/dQw4w9WgXcQ
```

**Embed URL:**
```
✅ https://www.youtube.com/embed/dQw4w9WgXcQ
```

**Shorts:**
```
✅ https://www.youtube.com/shorts/dQw4w9WgXcQ
```

### 2. Vimeo Videos

**Standard:**
```
✅ https://vimeo.com/123456789
✅ https://www.vimeo.com/123456789
```

**Player:**
```
✅ https://player.vimeo.com/video/123456789
```

### 3. Direct Video Files

```
✅ https://example.com/videos/intro.mp4
✅ https://cdn.example.com/content/tutorial.webm
✅ https://storage.example.com/presentation.mov
```

## Usage Examples

### Example 1: Photo Collage with Mixed Sources

```tsx
import { useState } from 'react';
import { ImageUpload } from '@/components/admin';

export function PhotoCollageForm() {
  const [images, setImages] = useState([
    // Already uploaded file
    {
      url: 'https://your-blob-storage.com/upload1.jpg',
      filename: 'upload1.jpg',
      size: 123456,
      type: 'image/jpeg'
    },
    // External URL from Unsplash
    {
      url: 'https://images.unsplash.com/photo-1234567890',
      filename: 'https://images.unsplash.com/photo-1234567890',
      size: 0,
      type: 'image/external'
    }
  ]);

  return (
    <ImageUpload
      images={images}
      onImagesChange={setImages}
      maxImages={20}
    />
  );
}
```

### Example 2: Video Content with YouTube URL

```tsx
import { useState } from 'react';
import { VideoUpload } from '@/components/admin';

export function VideoContentForm() {
  const [video, setVideo] = useState(null);

  return (
    <div>
      <VideoUpload
        video={video}
        onVideoChange={(video) => {
          if (video) {
            console.log('Video URL:', video.url);
            console.log('External?', video.type === 'video/external');
          }
        }}
      />

      {/* User can paste: https://www.youtube.com/watch?v=dQw4w9WgXcQ */}
      {/* System will auto-extract thumbnail and metadata */}
    </div>
  );
}
```

### Example 3: Team Member with CDN Photo

```tsx
export function TeamMemberForm() {
  const [photo, setPhoto] = useState(null);

  return (
    <ImageUpload
      images={photo ? [photo] : []}
      onImagesChange={(images) => {
        if (images.length > 0) {
          setPhoto(images[0]);
        }
      }}
      maxImages={1}
    />
  );

  // User can paste Cloudinary URL like:
  // https://res.cloudinary.com/demo/image/upload/v1234567890/profile.jpg
}
```

### Example 4: Book Publication with Cover Image URL

```tsx
export function BookPublicationForm() {
  const [coverImage, setCoverImage] = useState(null);

  const handleSubmit = async () => {
    const contentData = {
      coverImage: coverImage?.url, // Either uploaded URL or external URL
      // ... other fields
    };

    await fetch('/api/admin/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  };

  return (
    <ImageUpload
      images={coverImage ? [coverImage] : []}
      onImagesChange={(images) => setCoverImage(images[0] || null)}
      maxImages={1}
    />
  );
}
```

## Validation Examples

### Example 1: Validate Before Adding

```tsx
import { validateMediaUrl } from '@/lib/url-validation';

const [url, setUrl] = useState('');
const [error, setError] = useState('');

const handleAddUrl = async () => {
  const validation = await validateMediaUrl(url, 'image');

  if (!validation.isValid) {
    setError(validation.error);
    return;
  }

  // Add the validated URL
  setImages([...images, {
    url: validation.metadata.url,
    filename: validation.metadata.url,
    size: 0,
    type: 'image/external'
  }]);
};
```

### Example 2: Detect Media Type

```tsx
import { detectMediaType } from '@/lib/url-validation';

const handleUrlInput = (url: string) => {
  const type = detectMediaType(url);

  switch (type) {
    case 'image':
      console.log('This is an image URL');
      // Add to ImageUpload component
      break;
    case 'video':
      console.log('This is a video URL');
      // Add to VideoUpload component
      break;
    default:
      console.log('Unknown media type');
      break;
  }
};
```

### Example 3: Extract Video ID for Embedding

```tsx
import {
  extractYouTubeId,
  extractVimeoId,
  getVideoEmbedUrl
} from '@/lib/url-validation';

const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const youtubeId = extractYouTubeId(youtubeUrl); // 'dQw4w9WgXcQ'

const vimeoUrl = 'https://vimeo.com/123456789';
const vimeoId = extractVimeoId(vimeoUrl); // '123456789'

// Get embed URLs
const youtubeEmbed = getVideoEmbedUrl(youtubeUrl);
// 'https://www.youtube.com/embed/dQw4w9WgXcQ'

const vimeoEmbed = getVideoEmbedUrl(vimeoUrl);
// 'https://player.vimeo.com/video/123456789'
```

## Mixed Source Examples

### Example: Event with Both Uploaded and External Images

```tsx
export function EventForm() {
  const [banner, setBanner] = useState(null);
  const [gallery, setGallery] = useState([
    // Some uploaded images
    {
      url: 'https://your-storage.com/photo1.jpg',
      filename: 'photo1.jpg',
      size: 234567,
      type: 'image/jpeg'
    }
  ]);

  return (
    <div>
      {/* Banner - single image, can be URL or upload */}
      <ImageUpload
        images={banner ? [banner] : []}
        onImagesChange={(imgs) => setBanner(imgs[0] || null)}
        maxImages={1}
      />

      {/* Gallery - multiple images, mixed sources */}
      <ImageUpload
        images={gallery}
        onImagesChange={setGallery}
        maxImages={20}
      />
    </div>
  );
}
```

## Common Use Cases

### 1. Blog Posts with Unsplash Images
```
1. Go to unsplash.com
2. Find desired image
3. Click "Copy link" → "Copy image address"
4. Paste into ImageUpload "From URL" tab
```

### 2. YouTube Videos for Content
```
1. Go to YouTube video
2. Copy URL from browser address bar
3. Paste into VideoUpload "From URL" tab
4. System auto-extracts thumbnail
```

### 3. Company Logos from CDN
```
1. Get CDN link from your cloud storage
2. Paste into ImageUpload "From URL" tab
3. Use for team members, partners, etc.
```

### 4. Product Images from E-commerce Platform
```
1. Copy image URL from your product platform
2. Paste directly into ImageUpload
3. No need to download and re-upload
```

## Error Handling

### Example 1: Invalid URL
```
❌ not-a-url
→ Error: "Invalid URL format"
```

### Example 2: Wrong Media Type
```
❌ Video URL in ImageUpload: https://youtube.com/watch?v=xxx
→ Error: "Expected image URL, but got video"
```

### Example 3: Inaccessible Image
```
❌ https://private-site.com/image.jpg (requires auth)
→ Error: "Could not access image URL"
```

## Best Practices

1. **Use CDNs for static content** - Faster loading, better performance
2. **Prefer direct links** - Avoid HTML pages, link to actual image/video files
3. **Check file sizes** - Large external images slow down your site
4. **Test accessibility** - Ensure URLs are publicly accessible
5. **Use HTTPS** - Always use secure URLs
6. **Consider optimization** - Use services like Cloudinary for auto-optimization

## Troubleshooting

**URL not working?**
- Ensure it's a direct link (not a webpage)
- Check if the site requires authentication
- Verify the URL is publicly accessible
- Try opening the URL in a new browser tab

**Video not embedding?**
- YouTube: Ensure it's a valid YouTube URL
- Vimeo: Check if video is public
- Direct files: Verify the file format is supported

**Thumbnail not showing?**
- YouTube: Automatically fetched from video ID
- Vimeo: Uses vumbnail.com service (may have delays)
- Direct videos: No thumbnail available
