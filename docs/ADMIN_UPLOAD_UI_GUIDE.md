# Admin Upload UI Guide

## ImageUpload Component UI

### Tabbed Interface

```
┌─────────────────────────────────────────────────────────┐
│  [📁 Upload File]  [🔗 From URL]                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  When "Upload File" is active:                          │
│  ┌─────────────────────────────────────────┐           │
│  │          📤                              │           │
│  │   Drag & drop images here               │           │
│  │      or click to browse                 │           │
│  │   (0/10 uploaded)                       │           │
│  │                                         │           │
│  │  Supports: JPEG, PNG, WebP, GIF        │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  When "From URL" is active:                            │
│  ┌─────────────────────────────────────────┐           │
│  │  🔗 Image URL                            │           │
│  │  Paste a direct link to an image        │           │
│  │  ┌──────────────────────────────────┐  │           │
│  │  │ https://example.com/image.jpg    │  │           │
│  │  └──────────────────────────────────┘  │           │
│  │  [✓ Add]                                │           │
│  │                                         │           │
│  │  💡 Tip: You can use URLs from:        │           │
│  │  • CDN (Cloudinary, Imgur, etc.)       │           │
│  │  • Direct image links                  │           │
│  │  • Any publicly accessible image URL   │           │
│  └─────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

### Uploaded Images Preview

```
┌─────────────────────────────────────────────────────────┐
│  Uploaded Images (3/10)                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │          │  │ [URL]    │  │          │             │
│  │  Image   │  │  Image   │  │  Image   │             │
│  │          │  │          │  │          │             │
│  │  [×]     │  │  [×]     │  │  [×]     │             │
│  │ photo.jpg│  │ External │  │ pic.png  │             │
│  │  245 KB  │  │  URL     │  │  512 KB  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

## VideoUpload Component UI

### Tabbed Interface

```
┌─────────────────────────────────────────────────────────┐
│  [📁 Upload File]  [🔗 From URL]                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  When "Upload File" is active:                          │
│  ┌─────────────────────────────────────────┐           │
│  │          🎥                              │           │
│  │   Drag & drop video here                │           │
│  │      or click to browse                 │           │
│  │                                         │           │
│  │  Supports: MP4, WebM, MOV (max 50MB)   │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  When "From URL" is active:                            │
│  ┌─────────────────────────────────────────┐           │
│  │  🔗 Video URL                            │           │
│  │  Paste a YouTube, Vimeo, or direct      │           │
│  │  video link                              │           │
│  │  ┌──────────────────────────────────┐  │           │
│  │  │ https://www.youtube.com/watch?v=│  │           │
│  │  └──────────────────────────────────┘  │           │
│  │  [✓ Add]                                │           │
│  │                                         │           │
│  │  💡 Supported platforms:                │           │
│  │  • YouTube (youtube.com, youtu.be)      │           │
│  │  • Vimeo (vimeo.com)                    │           │
│  │  • Direct video files (MP4, WebM, MOV)  │           │
│  └─────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

### Uploaded Video Preview

```
┌─────────────────────────────────────────────────────────┐
│  When video is uploaded (file):                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 🎥 Video uploaded successfully                     │  │
│  │ Filename: presentation.mp4                        │  │
│  │ Size: 12.5 MB                                    │  │
│  │ URL: https://your-blob.com/video-123.mp4          │  │
│  │                                          [Remove] │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  When video is from URL (YouTube):                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │ 🔗 YouTube                                 [🖼️]    │  │
│  │ Filename: https://www.youtube.com/watch?v=abc    │  │
│  │ Size: External URL                                │  │
│  │ URL: https://www.youtube.com/watch?v=abc [↗️]     │  │
│  │ ✓ YouTube video detected                          │  │
│  │                                          [Remove] │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Workflow Examples

### Example 1: Creating Photo Collage

```
Step 1: Go to Content → Add New → Photo Collage

Step 2: Fill in title and description

Step 3: Add photos using either method:
  Method A - Upload Files:
  → Click "Upload File" tab
  → Drag & drop 5 photos from computer
  → See preview thumbnails appear

  Method B - Use URLs:
  → Click "From URL" tab
  → Paste Unsplash URLs one by one
  → Click "Add" for each URL
  → See thumbnails appear

Step 4: Add captions and alt text for each photo

Step 5: Save draft or publish
```

### Example 2: Adding YouTube Video

```
Step 1: Go to Content → Add New → Video Content

Step 2: Fill in title, description, category

Step 3: Add video URL:
  → Click "From URL" tab
  → Paste: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  → Click "Add"
  → See thumbnail appear with "YouTube" badge
  → ✓ Video detected message

Step 4: Save draft or publish
```

### Example 3: Team Member with CDN Photo

```
Step 1: Go to Content → Add New → Team Member

Step 2: Fill in name, role, bio

Step 3: Add photo:
  Option A - Upload file from computer:
  → Click "Upload File" tab
  → Select photo from computer
  → Uploads automatically

  Option B - Use Cloudinary URL:
  → Click "From URL" tab
  → Paste: https://res.cloudinary.com/demo/image/upload/v123/photo.jpg
  → Click "Add"
  → Image appears instantly

Step 4: Add LinkedIn URL (optional)

Step 5: Save
```

## Visual Feedback

### Success States

✅ **File Upload Success**
```
- Uploading... → Progress bar → Image preview appears
- "Image uploaded successfully"
- Thumbnail shows in preview grid
```

✅ **URL Validation Success**
```
- Validating URL... → Green checkmark
- Thumbnail appears for videos
- "URL" badge on external images
- Provider badge for videos (YouTube/Vimeo)
```

### Error States

❌ **File Upload Error**
```
- Red error message: "File size exceeds 5MB limit"
- "Upload failed" with details
- No preview added
```

❌ **URL Validation Error**
```
- Red message below input: "Invalid image URL"
- "Expected image URL, but got video"
- "Could not detect media type"
```

## Dark Mode

All components support dark mode with:
- Dark backgrounds for cards
- Light text for readability
- Proper border colors
- Maintained contrast ratios

## Accessibility

- Keyboard navigation support (Tab, Enter)
- Screen reader friendly labels
- Alt text inputs for images
- Focus indicators on interactive elements
- ARIA labels where needed

## Performance

- Lazy loading for image previews
- Optimized thumbnail generation
- Efficient state management
- Minimal re-renders
- Fast URL validation

## Mobile Responsiveness

- Touch-friendly drop zones
- Responsive grid layouts
- Stacked layouts on small screens
- Full-width inputs on mobile
- Accessible touch targets (min 44px)
