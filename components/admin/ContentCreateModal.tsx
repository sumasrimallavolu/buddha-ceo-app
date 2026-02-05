'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
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
import { Loader2, CheckCircle2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';

interface ContentCreateModalProps {
  trigger?: React.ReactNode;
  defaultType?: string;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContentCreateModal({
  trigger,
  defaultType = 'photo_collage',
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: ContentCreateModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [contentType, setContentType] = useState(defaultType);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [richTextContent, setRichTextContent] = useState('');
  const [autoPublish, setAutoPublish] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: defaultType,
    description: '',
    category: '',
    videoUrl: '',
    image: '',
    author: '',
    downloadUrl: '',
    purchaseUrl: '',
    layout: 'grid',
    isFeatured: false,
  });

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value);
    } else {
      setOpen(value);
    }
  };

  // Check if user has auto-publish capability (content_manager or admin)
  const canAutoPublish = session?.user?.role === 'content_manager' || session?.user?.role === 'admin';

  useEffect(() => {
    if (isOpen) {
      setContentType(defaultType);
      setFormData({
        title: '',
        type: defaultType,
        description: '',
        category: '',
        videoUrl: '',
        image: '',
        author: '',
        downloadUrl: '',
        purchaseUrl: '',
        layout: 'grid',
        isFeatured: false,
      });
      setUploadedImages([]);
      setRichTextContent('');
      setError('');
      setSuccess(false);
      setAutoPublish(false);
    }
  }, [isOpen, defaultType]);

  const handleSubmit = async (saveAsDraft: boolean, publishDirectly: boolean = false) => {
    setError('');
    setSuccess(false);

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      const contentData: Record<string, any> = {};

      switch (contentType) {
        case 'photo_collage':
          contentData.images = uploadedImages.map(img => ({ url: img.url, alt: '', caption: '' }));
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
          contentData.downloadUrl = formData.downloadUrl;
          contentData.purchaseUrl = formData.purchaseUrl;
          contentData.description = formData.description;
          contentData.category = formData.category;
          break;

        case 'mixed_media':
          contentData.content = richTextContent;
          contentData.description = formData.description;
          contentData.category = formData.category;
          break;

        default:
          contentData.description = formData.description;
          break;
      }

      // Determine status based on user role and actions
      let status = 'draft';
      if (publishDirectly && canAutoPublish) {
        status = 'published';
      } else if (!saveAsDraft) {
        status = 'pending_review';
      }

      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          type: contentType,
          status,
          content: contentData,
          thumbnailUrl: formData.image || uploadedImages[0]?.url,
          layout: formData.layout,
          isFeatured: formData.isFeatured,
          autoPublish: publishDirectly,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create content');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  const renderTypeForm = () => {
    switch (contentType) {
      case 'photo_collage':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="layout">Layout Style</Label>
              <Select
                value={formData.layout}
                onValueChange={(value) => setFormData({ ...formData, layout: value })}
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
                onImagesChange={setUploadedImages}
                maxImages={20}
              />
            </div>
          </div>
        );

      case 'video_content':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Thumbnail Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://i.ytimg.com/vi/.../maxresdefault.jpg"
              />
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
                rows={3}
              />
            </div>
          </div>
        );

      case 'book_publication':
        return (
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this publication..."
                rows={3}
              />
            </div>
          </div>
        );

      case 'mixed_media':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="richContent">Content</Label>
              <RichTextEditor
                content={richTextContent}
                onChange={setRichTextContent}
                placeholder="Write your content here..."
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
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description..."
                rows={3}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
          <DialogDescription>
            Quick create content for the website
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Content created successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter content title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Content Type *</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photo_collage">Photo Collage</SelectItem>
                <SelectItem value="video_content">Video Content</SelectItem>
                <SelectItem value="book_publication">Book/Publication</SelectItem>
                <SelectItem value="mixed_media">Mixed Media Article</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
                <SelectItem value="testimonial">Testimonial</SelectItem>
                <SelectItem value="service">Service (Vision/Mission)</SelectItem>
                <SelectItem value="poster">Poster</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-4">
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

            {renderTypeForm()}
          </div>

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

          {canAutoPublish && (
            <div className="flex items-center space-x-2 border-t pt-4">
              <Checkbox
                id="autoPublish"
                checked={autoPublish}
                onCheckedChange={(checked) => setAutoPublish(checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="autoPublish" className="cursor-pointer">
                  Publish directly (skip review)
                </Label>
                <p className="text-xs text-gray-500">
                  As a {session?.user?.role === 'admin' ? 'n admin' : 'content manager'}, you can publish content without review
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(true, false)}
            disabled={loading || success}
            className="flex-1 sm:flex-none"
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
            variant="outline"
            onClick={() => handleSubmit(false, false)}
            disabled={loading || success}
            className="flex-1 sm:flex-none"
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

          {canAutoPublish && (
            <Button
              type="button"
              className="bg-amber-600 flex-1 sm:flex-none"
              onClick={() => handleSubmit(false, true)}
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Publish Now
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
