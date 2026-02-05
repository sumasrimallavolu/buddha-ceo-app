'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, Edit, Save, Send } from 'lucide-react';
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

interface ContentEditModalProps {
  contentId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContentEditModal({
  contentId,
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: ContentEditModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [richTextContent, setRichTextContent] = useState('');

  const canAutoPublish = session?.user?.role === 'content_manager' || session?.user?.role === 'admin';

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value);
    } else {
      setOpen(value);
    }
  };

  const fetchContent = async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/admin/content/${contentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      setContent(data);

      // Initialize form data
      if (data.type === 'mixed_media' && data.content?.content) {
        setRichTextContent(data.content.content);
      }

      if (data.content?.coverImage || data.content?.image) {
        setUploadedImages([{ url: data.content.coverImage || data.content.image, filename: '', size: 0, type: '' }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen && contentId) {
      fetchContent();
      setError('');
      setSuccess(false);
    }
  }, [isOpen, contentId]);

  const handleUpdateField = (field: string, value: any) => {
    setContent({
      ...content,
      content: {
        ...content.content,
        [field]: value,
      },
    });
  };

  const handleSubmit = async (saveAsDraft = false, submitForReview = false, autoPublish = false) => {
    if (!content.title) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const contentData: Record<string, any> = {};

      switch (content.type) {
        case 'photo_collage':
          contentData.images = content.content?.images || [];
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
          contentData.downloadUrl = content.content?.downloadUrl || '';
          contentData.purchaseUrl = content.content?.purchaseUrl || '';
          contentData.description = content.content?.description || '';
          contentData.category = content.content?.category || '';
          break;

        case 'mixed_media':
          contentData.content = richTextContent;
          contentData.description = content.content?.description || '';
          contentData.category = content.content?.category || '';
          break;

        default:
          contentData.description = content.content?.description || '';
          break;
      }

      // Determine status
      let contentStatus = 'draft';
      if (autoPublish && canAutoPublish) {
        contentStatus = 'published';
      } else if (submitForReview) {
        contentStatus = 'pending_review';
      } else if (!saveAsDraft && canAutoPublish) {
        contentStatus = 'published';
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
          status: contentStatus,
          autoPublish,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update content');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
    } finally {
      setLoading(false);
    }
  };

  const renderEditForm = () => {
    if (!content) return null;

    switch (content.type) {
      case 'photo_collage':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="layout">Layout Style</Label>
              <select
                id="layout"
                value={content.content?.layout || 'grid'}
                onChange={(e) => handleUpdateField('layout', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="grid">Grid (Equal columns)</option>
                <option value="masonry">Masonry (Pinterest-style)</option>
                <option value="slider">Slider (Carousel)</option>
              </select>
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
          </div>
        );

      case 'video_content':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={content.content?.videoUrl || ''}
                onChange={(e) => handleUpdateField('videoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
              <Input
                id="thumbnail"
                value={content.content?.thumbnail || ''}
                onChange={(e) => handleUpdateField('thumbnail', e.target.value)}
                placeholder="https://i.ytimg.com/vi/.../maxresdefault.jpg"
              />
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
                rows={3}
              />
            </div>
          </div>
        );

      case 'book_publication':
        return (
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={content.content?.description || ''}
                onChange={(e) => handleUpdateField('description', e.target.value)}
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
                value={content.content?.category || ''}
                onChange={(e) => handleUpdateField('category', e.target.value)}
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
                value={content.content?.description || ''}
                onChange={(e) => handleUpdateField('description', e.target.value)}
                placeholder="Enter description..."
                rows={3}
              />
            </div>
          </div>
        );
    }
  };

  if (fetching) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription>
            Update {content?.type?.replace('_', ' ')} content
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
                Content updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {content && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  placeholder="Enter content title"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-4">
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

                {renderEditForm()}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading || success}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(true, false, false)}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(false, true, false)}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </>
            )}
          </Button>
          {canAutoPublish && (
            <Button
              type="button"
              className="bg-green-600"
              onClick={() => handleSubmit(false, false, true)}
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
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
