'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowLeft, CheckCircle2, Plus, X, Eye } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Highlight {
  text: string;
}

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface PhotoCollageImage {
  url: string;
  caption?: string;
  alt?: string;
}

export default function NewContentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [contentType, setContentType] = useState<string>('photo_collage');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [photoCollageImages, setPhotoCollageImages] = useState<PhotoCollageImage[]>([]);
  const [richTextContent, setRichTextContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'photo_collage',
    description: '',
    icon: 'award',
    category: '',
    year: '',
    image: '',
    role: '',
    bio: '',
    quote: '',
    subtitle: '',
    videoUrl: '',
    linkedin: '',
    // New fields
    author: '',
    isbn: '',
    pages: '',
    downloadUrl: '',
    purchaseUrl: '',
    layout: 'grid',
    isFeatured: false,
  });

  // Redirect non-authorized users
  const userRole = session?.user?.role;
  const canEdit = userRole === 'admin' || userRole === 'content_manager';

  if (!canEdit) {
    router.push('/admin');
    return null;
  }

  const handleAddHighlight = () => {
    setHighlights([...highlights, { text: '' }]);
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index].text = value;
    setHighlights(newHighlights);
  };

  const handlePhotoCollageImageUpdate = (index: number, field: string, value: string) => {
    const newImages = [...photoCollageImages];
    newImages[index] = { ...newImages[index], [field]: value };
    setPhotoCollageImages(newImages);
  };

  const handleRemovePhotoCollageImage = (index: number) => {
    setPhotoCollageImages(photoCollageImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    setError('');
    setSuccess(false);

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    // Build content object based on type
    const contentData: Record<string, any> = {};

    switch (contentType) {
      case 'achievement':
        contentData.icon = formData.icon;
        contentData.description = formData.description;
        contentData.category = formData.category;
        contentData.year = formData.year;
        contentData.highlights = highlights.filter(h => h.text.trim());
        break;

      case 'team_member':
        contentData.role = formData.role;
        contentData.bio = formData.bio;
        contentData.image = formData.image;
        contentData.quote = formData.quote;
        contentData.linkedin = formData.linkedin;
        break;

      case 'testimonial':
        contentData.subtitle = formData.subtitle;
        contentData.videoUrl = formData.videoUrl;
        contentData.image = formData.image;
        contentData.quote = formData.quote;
        break;

      case 'service':
        contentData.description = formData.description;
        break;

      case 'poster':
        contentData.image = formData.image;
        contentData.description = formData.description;
        break;

      case 'photo_collage':
        contentData.images = photoCollageImages;
        contentData.layout = formData.layout;
        contentData.description = formData.description;
        break;

      case 'video_content':
        contentData.videoUrl = formData.videoUrl;
        contentData.thumbnail = formData.image;
        contentData.description = formData.description;
        contentData.category = formData.category;
        break;

      case 'book_publication':
        contentData.coverImage = formData.image;
        contentData.author = formData.author;
        contentData.isbn = formData.isbn;
        contentData.pages = formData.pages;
        contentData.downloadUrl = formData.downloadUrl;
        contentData.purchaseUrl = formData.purchaseUrl;
        contentData.description = formData.description;
        contentData.category = formData.category;
        break;

      case 'mixed_media':
        contentData.content = richTextContent;
        contentData.images = uploadedImages.map(img => img.url);
        contentData.description = formData.description;
        contentData.category = formData.category;
        break;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          type: contentType,
          status: saveAsDraft ? 'draft' : 'pending_review',
          content: contentData,
          thumbnailUrl: formData.image || photoCollageImages[0]?.url,
          layout: formData.layout,
          isFeatured: formData.isFeatured,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create content');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/content');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  const renderPhotoCollageForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="layout">Layout Style</Label>
        <Select value={formData.layout} onValueChange={(value) => setFormData({ ...formData, layout: value })}>
          <SelectTrigger id="layout">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid (Equal columns)</SelectItem>
            <SelectItem value="masonry">Masonry (Pinterest-style)</SelectItem>
            <SelectItem value="slider">Slider (Carousel)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Add a description for this photo collage..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Photos</Label>
        <ImageUpload
          images={uploadedImages}
          onImagesChange={(images) => {
            setUploadedImages(images);
            setPhotoCollageImages([
              ...photoCollageImages,
              ...images.map(img => ({ url: img.url, caption: '', alt: '' }))
            ]);
          }}
          maxImages={20}
        />
      </div>

      {photoCollageImages.length > 0 && (
        <div className="space-y-3 border-t pt-4">
          <Label>Photo Details</Label>
          {photoCollageImages.map((img, index) => (
            <Card key={index} className="p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <img
                    src={img.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <Label htmlFor={`alt-${index}`}>Alt Text</Label>
                    <Input
                      id={`alt-${index}`}
                      value={img.alt || ''}
                      onChange={(e) => handlePhotoCollageImageUpdate(index, 'alt', e.target.value)}
                      placeholder="Describe this image for accessibility"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`caption-${index}`}>Caption (Optional)</Label>
                    <Input
                      id={`caption-${index}`}
                      value={img.caption || ''}
                      onChange={(e) => handlePhotoCollageImageUpdate(index, 'caption', e.target.value)}
                      placeholder="Add a caption for this photo"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePhotoCollageImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderVideoContentForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input
          id="videoUrl"
          value={formData.videoUrl}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="text-xs text-muted-foreground">
          Supports YouTube and Vimeo URLs
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Thumbnail Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://i.ytimg.com/vi/.../maxresdefault.jpg"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to auto-fetch from YouTube
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Meditation techniques, Talks, Events..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this video content..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderBookPublicationForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Cover Image</Label>
        <ImageUpload
          images={uploadedImages}
          onImagesChange={(images) => {
            setUploadedImages(images);
            if (images.length > 0) {
              setFormData({ ...formData, image: images[0].url });
            }
          }}
          maxImages={1}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="Author name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN (Optional)</Label>
          <Input
            id="isbn"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            placeholder="978-3-16-148410-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pages">Pages (Optional)</Label>
          <Input
            id="pages"
            type="number"
            value={formData.pages}
            onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
            placeholder="200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="downloadUrl">Download URL (Optional)</Label>
        <Input
          id="downloadUrl"
          value={formData.downloadUrl}
          onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
          placeholder="https://example.com/book.pdf"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchaseUrl">Purchase URL (Optional)</Label>
        <Input
          id="purchaseUrl"
          value={formData.purchaseUrl}
          onChange={(e) => setFormData({ ...formData, purchaseUrl: e.target.value })}
          placeholder="https://amazon.com/..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Books, Guides, Manuals..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this publication..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderMixedMediaForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Content</Label>
        <RichTextEditor
          content={richTextContent}
          onChange={setRichTextContent}
          placeholder="Write your content here, add images, videos, and format text..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Articles, Blog posts, News..."
        />
      </div>

      <div className="space-y-2">
        <Label>Additional Images (Optional)</Label>
        <ImageUpload
          images={uploadedImages}
          onImagesChange={setUploadedImages}
          maxImages={10}
        />
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (contentType) {
      case 'photo_collage':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{formData.title || 'Photo Collage'}</h3>
            {formData.description && <p className="text-gray-600">{formData.description}</p>}
            <div className={`grid gap-4 ${
              formData.layout === 'masonry' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'
            }`}>
              {photoCollageImages.slice(0, 6).map((img, i) => (
                <div key={i} className="relative aspect-square">
                  <img src={img.url} alt={img.alt || `Photo ${i + 1}`} className="w-full h-full object-cover rounded" />
                  {img.caption && <p className="text-sm mt-2">{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'video_content':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{formData.title || 'Video Content'}</h3>
            {formData.category && <span className="text-sm bg-purple-100 px-2 py-1 rounded">{formData.category}</span>}
            {formData.description && <p className="text-gray-600">{formData.description}</p>}
            <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
              {formData.videoUrl ? <p className="text-gray-500">Video will be embedded here</p> : <p className="text-gray-400">No video URL provided</p>}
            </div>
          </div>
        );

      case 'book_publication':
        return (
          <div className="flex gap-6">
            {formData.image && (
              <div className="w-48 flex-shrink-0">
                <img src={formData.image} alt="Book cover" className="w-full rounded shadow-lg" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold">{formData.title || 'Book Title'}</h3>
              {formData.author && <p className="text-gray-600">By {formData.author}</p>}
              {formData.description && <p className="text-gray-600 mt-4">{formData.description}</p>}
              <div className="flex gap-4 mt-4">
                {formData.downloadUrl && <Button>Download</Button>}
                {formData.purchaseUrl && <Button variant="outline">Purchase</Button>}
              </div>
            </div>
          </div>
        );

      case 'mixed_media':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{formData.title || 'Article'}</h3>
            {richTextContent ? (
              <div dangerouslySetInnerHTML={{ __html: richTextContent }} />
            ) : (
              <p className="text-gray-400">No content added yet</p>
            )}
          </div>
        );

      default:
        return <p className="text-gray-500">Preview not available for this content type</p>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/content">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
          <p className="mt-2 text-gray-600">
            Add new content to the meditation institute website
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Content created successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
          <CardDescription>
            Fill in the information for your new content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter content title"
              />
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Content Type *</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo_collage">Photo Collage (New)</SelectItem>
                  <SelectItem value="video_content">Video Content (New)</SelectItem>
                  <SelectItem value="book_publication">Book/Publication (New)</SelectItem>
                  <SelectItem value="mixed_media">Mixed Media Article (New)</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="team_member">Team Member</SelectItem>
                  <SelectItem value="testimonial">Testimonial</SelectItem>
                  <SelectItem value="service">Service (Vision/Mission)</SelectItem>
                  <SelectItem value="poster">Poster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type-specific Fields */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">
                {contentType === 'photo_collage' && 'Photo Collage Details'}
                {contentType === 'video_content' && 'Video Content Details'}
                {contentType === 'book_publication' && 'Publication Details'}
                {contentType === 'mixed_media' && 'Article Content'}
                {contentType === 'achievement' && 'Achievement Details'}
                {contentType === 'team_member' && 'Team Member Information'}
                {contentType === 'testimonial' && 'Testimonial Details'}
                {contentType === 'service' && 'Service Description'}
                {contentType === 'poster' && 'Poster Information'}
              </h3>

              {contentType === 'photo_collage' && renderPhotoCollageForm()}
              {contentType === 'video_content' && renderVideoContentForm()}
              {contentType === 'book_publication' && renderBookPublicationForm()}
              {contentType === 'mixed_media' && renderMixedMediaForm()}
            </div>

            {/* Featured Content */}
            {['photo_collage', 'video_content', 'book_publication'].includes(contentType) && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked as boolean })}
                />
                <Label htmlFor="featured">Feature on homepage</Label>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Link href="/admin/content">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save as Draft'
                )}
              </Button>
              <Button
                type="button"
                className="bg-purple-600"
                onClick={() => handleSubmit(false)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit for Review'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <div className="w-3 h-3 bg-gray-600 rounded-full" />
            </div>
            <div>
              <div className="font-medium">Draft</div>
              <div className="text-sm text-muted-foreground">Content is being created/edited</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <div className="w-3 h-3 bg-yellow-600 rounded-full" />
            </div>
            <div>
              <div className="font-medium">Pending Review</div>
              <div className="text-sm text-muted-foreground">Waiting for reviewer approval</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
            </div>
            <div>
              <div className="font-medium">Published</div>
              <div className="text-sm text-muted-foreground">Live on the website</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Content Preview</DialogTitle>
            <DialogDescription>
              See how your content will appear on the website
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {renderPreview()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
