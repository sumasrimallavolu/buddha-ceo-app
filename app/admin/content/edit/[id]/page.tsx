'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowLeft, CheckCircle2, Eye } from 'lucide-react';
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

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [photoCollageImages, setPhotoCollageImages] = useState<PhotoCollageImage[]>([]);
  const [richTextContent, setRichTextContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const contentId = params.id as string;

  // Redirect non-authorized users
  const userRole = session?.user?.role;
  const canEdit = userRole === 'admin' || userRole === 'content_manager';

  useEffect(() => {
    if (!canEdit && session) {
      router.push('/admin');
      return;
    }

    if (canEdit && contentId) {
      fetchContent();
    }
  }, [canEdit, contentId, session]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/admin/content/${contentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      setContent(data);

      // Initialize form data based on content type
      if (data.type === 'photo_collage' && data.content?.images) {
        setPhotoCollageImages(data.content.images);
      }

      if (data.type === 'mixed_media' && data.content?.content) {
        setRichTextContent(data.content.content);
      }

      if (data.content?.highlights) {
        setHighlights(data.content.highlights.map((h: string) => ({ text: h })));
      }

      if (data.content?.coverImage || data.content?.image) {
        setUploadedImages([{ url: data.content.coverImage || data.content.image, filename: '', size: 0, type: '' }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    setError('');
    setSuccess(false);

    if (!content.title) {
      setError('Title is required');
      return;
    }

    setSaving(true);

    try {
      const contentData: Record<string, any> = {};

      switch (content.type) {
        case 'achievement':
          contentData.icon = content.content?.icon || 'award';
          contentData.description = content.content?.description || '';
          contentData.category = content.content?.category || '';
          contentData.year = content.content?.year || '';
          contentData.highlights = highlights.filter(h => h.text.trim());
          break;

        case 'team_member':
          contentData.role = content.content?.role || '';
          contentData.bio = content.content?.bio || '';
          contentData.image = content.content?.image || '';
          contentData.quote = content.content?.quote || '';
          contentData.linkedin = content.content?.linkedin || '';
          break;

        case 'testimonial':
          contentData.subtitle = content.content?.subtitle || '';
          contentData.videoUrl = content.content?.videoUrl || '';
          contentData.image = content.content?.image || '';
          contentData.quote = content.content?.quote || '';
          break;

        case 'service':
          contentData.description = content.content?.description || '';
          break;

        case 'poster':
          contentData.image = content.content?.image || '';
          contentData.description = content.content?.description || '';
          break;

        case 'photo_collage':
          contentData.images = photoCollageImages;
          contentData.layout = content.content?.layout || 'grid';
          contentData.description = content.content?.description || '';
          break;

        case 'video_content':
          contentData.videoUrl = content.content?.videoUrl || '';
          contentData.thumbnail = content.content?.thumbnail || '';
          contentData.description = content.content?.description || '';
          contentData.category = content.content?.category || '';
          break;

        case 'book_publication':
          contentData.coverImage = content.content?.coverImage || '';
          contentData.author = content.content?.author || '';
          contentData.isbn = content.content?.isbn || '';
          contentData.pages = content.content?.pages || '';
          contentData.downloadUrl = content.content?.downloadUrl || '';
          contentData.purchaseUrl = content.content?.purchaseUrl || '';
          contentData.description = content.content?.description || '';
          contentData.category = content.content?.category || '';
          break;

        case 'mixed_media':
          contentData.content = richTextContent;
          contentData.images = uploadedImages.map(img => img.url);
          contentData.description = content.content?.description || '';
          contentData.category = content.content?.category || '';
          break;
      }

      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: content.title,
          type: content.type,
          content: contentData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update content');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/content');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateField = (field: string, value: any) => {
    setContent({
      ...content,
      content: {
        ...content.content,
        [field]: value,
      },
    });
  };

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

  const renderPhotoCollageForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="layout">Layout Style</Label>
        <Select
          value={content.content?.layout || 'grid'}
          onValueChange={(value) => handleUpdateField('layout', value)}
        >
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
          value={content.content?.description || ''}
          onChange={(e) => handleUpdateField('description', e.target.value)}
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
                  ×
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
          value={content.content?.videoUrl || ''}
          onChange={(e) => handleUpdateField('videoUrl', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="text-xs text-muted-foreground">
          Supports YouTube and Vimeo URLs
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
        <Input
          id="thumbnail"
          value={content.content?.thumbnail || ''}
          onChange={(e) => handleUpdateField('thumbnail', e.target.value)}
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
          value={content.content?.category || ''}
          onChange={(e) => handleUpdateField('category', e.target.value)}
          placeholder="Meditation techniques, Talks, Events..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={content.content?.description || ''}
          onChange={(e) => handleUpdateField('description', e.target.value)}
          placeholder="Describe this video content..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderBookPublicationForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image</Label>
        <ImageUpload
          images={uploadedImages}
          onImagesChange={(images) => {
            setUploadedImages(images);
            if (images.length > 0) {
              handleUpdateField('coverImage', images[0].url);
            }
          }}
          maxImages={1}
        />
        {uploadedImages.length === 0 && content.content?.coverImage && (
          <img src={content.content.coverImage} alt="Current cover" className="w-32 rounded" />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={content.content?.author || ''}
          onChange={(e) => handleUpdateField('author', e.target.value)}
          placeholder="Author name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN (Optional)</Label>
          <Input
            id="isbn"
            value={content.content?.isbn || ''}
            onChange={(e) => handleUpdateField('isbn', e.target.value)}
            placeholder="978-3-16-148410-0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pages">Pages (Optional)</Label>
          <Input
            id="pages"
            type="number"
            value={content.content?.pages || ''}
            onChange={(e) => handleUpdateField('pages', e.target.value)}
            placeholder="200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="downloadUrl">Download URL (Optional)</Label>
        <Input
          id="downloadUrl"
          value={content.content?.downloadUrl || ''}
          onChange={(e) => handleUpdateField('downloadUrl', e.target.value)}
          placeholder="https://example.com/book.pdf"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchaseUrl">Purchase URL (Optional)</Label>
        <Input
          id="purchaseUrl"
          value={content.content?.purchaseUrl || ''}
          onChange={(e) => handleUpdateField('purchaseUrl', e.target.value)}
          placeholder="https://amazon.com/..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={content.content?.category || ''}
          onChange={(e) => handleUpdateField('category', e.target.value)}
          placeholder="Books, Guides, Manuals..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={content.content?.description || ''}
          onChange={(e) => handleUpdateField('description', e.target.value)}
          placeholder="Describe this publication..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderMixedMediaForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="richContent">Content</Label>
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
          value={content.content?.category || ''}
          onChange={(e) => handleUpdateField('category', e.target.value)}
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

  const renderFormByType = () => {
    switch (content.type) {
      case 'photo_collage':
        return renderPhotoCollageForm();
      case 'video_content':
        return renderVideoContentForm();
      case 'book_publication':
        return renderBookPublicationForm();
      case 'mixed_media':
        return renderMixedMediaForm();
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={content.content?.description || ''}
                onChange={(e) => handleUpdateField('description', e.target.value)}
                placeholder="Enter description..."
                rows={4}
              />
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Content not found</p>
        <Link href="/admin/content">
          <Button className="mt-4">Back to Content</Button>
        </Link>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
          <p className="mt-2 text-gray-600">
            Update {content.type.replace('_', ' ')} content
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
            Content updated successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Content</CardTitle>
          <CardDescription>
            Update the information for this content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Enter content title"
              />
            </div>

            {/* Type-specific Fields */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">
                {content.type === 'photo_collage' && 'Photo Collage Details'}
                {content.type === 'video_content' && 'Video Content Details'}
                {content.type === 'book_publication' && 'Publication Details'}
                {content.type === 'mixed_media' && 'Article Content'}
                {content.type === 'achievement' && 'Achievement Details'}
                {content.type === 'team_member' && 'Team Member Information'}
                {content.type === 'testimonial' && 'Testimonial Details'}
                {content.type === 'service' && 'Service Description'}
                {content.type === 'poster' && 'Poster Information'}
              </h3>

              {renderFormByType()}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Link href="/admin/content">
                <Button type="button" variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                className="bg-amber-600"
                onClick={() => handleSubmit(false)}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
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
            <h3 className="text-xl font-bold">{content.title}</h3>
            <p className="text-gray-600">{content.type.replace('_', ' ')}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
