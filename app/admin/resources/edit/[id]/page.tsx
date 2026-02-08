'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, BookOpen, Video, FileText, Link as LinkIcon, Quote, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import VideoUpload from '@/components/admin/VideoUpload';
import DocumentUpload from '@/components/admin/DocumentUpload';
import ImageUpload from '@/components/admin/ImageUpload';

export default function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resource, setResource] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);
  const [downloadFile, setDownloadFile] = useState<any>(null);
  const [thumbnailImages, setThumbnailImages] = useState<any[]>([]);

  const userRole = session?.user?.role;
  const canEdit = userRole === 'admin' || userRole === 'content_manager';

  useEffect(() => {
    if (!canEdit) {
      router.push('/admin');
      return;
    }

    fetchResource();
  }, []);

  const fetchResource = async () => {
    setFetching(true);
    try {
      const { id } = await params;
      const response = await fetch(`/api/admin/resources/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch resource');
      }

      setResource(data);

      // Initialize file objects from existing URLs
      if (data.videoUrl) {
        setVideoFile({
          url: data.videoUrl,
          filename: 'Video',
          size: 0,
          type: 'video/external',
        });
      }

      if (data.downloadUrl) {
        setDownloadFile({
          url: data.downloadUrl,
          filename: 'Document',
          size: 0,
          type: 'application/pdf',
        });
      }

      if (data.thumbnailUrl) {
        setThumbnailImages([{
          url: data.thumbnailUrl,
          filename: 'Thumbnail',
          size: 0,
          type: 'image/external',
        }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resource');
    } finally {
      setFetching(false);
    }
  };

  const handleUpdateField = (field: string, value: any) => {
    setResource({
      ...resource,
      [field]: value
    });
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    if (!resource?.title) {
      setError('Title is required');
      return;
    }

    // For non-testimonials and non-blogs, description is required
    if (resource.type !== 'testimonial' && resource.type !== 'blog' && !resource.description?.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { id } = await params;
      const resourceData = {
        ...resource,
        status: saveAsDraft ? 'draft' : 'published',
      };

      const response = await fetch(`/api/admin/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update resource');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/resources');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resource');
    } finally {
      setLoading(false);
    }
  };

  if (!canEdit) {
    return null;
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading resource...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/admin/resources')}
          className="text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Edit Resource</h1>
          <p className="text-slate-400 text-sm">Update resource details</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Resource updated successfully! Redirecting...</AlertDescription>
        </Alert>
      )}

      {resource && (
        <>
          {/* Resource Type Badge */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-white/5 text-slate-300 text-sm font-medium border border-white/10 flex items-center gap-2">
              {resource.type === 'book' && <BookOpen className="h-4 w-4" />}
              {resource.type === 'video' && <Video className="h-4 w-4" />}
              {resource.type === 'magazine' && <FileText className="h-4 w-4" />}
              {(resource.type === 'link' || resource.type === 'blog') && <LinkIcon className="h-4 w-4" />}
              {resource.type === 'testimonial' && <Quote className="h-4 w-4" />}
              <span className="capitalize">{resource.type === 'testimonial' ? 'Testimonial' : resource.type === 'blog' ? 'Blog Post' : resource.type}</span>
            </div>
            <Badge className="bg-slate-700 text-slate-300">Cannot be changed</Badge>
          </div>

          {/* Main Form Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="pt-6 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white text-sm font-medium">
                  Title <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  value={resource.title}
                  onChange={(e) => handleUpdateField('title', e.target.value)}
                  placeholder="Resource title"
                  disabled={loading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              {/* Description (not for testimonials or blogs) */}
              {resource.type !== 'testimonial' && resource.type !== 'blog' && (
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300 text-sm">
                    Description <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={resource.description || ''}
                    onChange={(e) => handleUpdateField('description', e.target.value)}
                    placeholder="Describe this resource..."
                    rows={3}
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              )}

              {/* Description (optional for blogs) */}
              {resource.type === 'blog' && (
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300 text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={resource.description || ''}
                    onChange={(e) => handleUpdateField('description', e.target.value)}
                    placeholder="Brief description of the blog post (optional)..."
                    rows={3}
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              )}

              {/* Type-specific fields */}
              {resource.type === 'video' && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Video className="h-5 w-5 text-blue-400" />
                    <h3 className="text-white font-semibold">Video Details</h3>
                  </div>
                  <VideoUpload
                    video={videoFile}
                    onVideoChange={(video) => {
                      setVideoFile(video);
                      handleUpdateField('videoUrl', video?.url || '');
                    }}
                  />
                </div>
              )}

              {resource.type === 'testimonial' && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Quote className="h-5 w-5 text-blue-400" />
                    <h3 className="text-white font-semibold">Testimonial Details</h3>
                  </div>
                  <VideoUpload
                    video={videoFile}
                    onVideoChange={(video) => {
                      setVideoFile(video);
                      handleUpdateField('videoUrl', video?.url || '');
                    }}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="subtitle" className="text-slate-300 text-sm">
                      Subtitle/Role
                    </Label>
                    <Input
                      id="subtitle"
                      value={resource.subtitle || ''}
                      onChange={(e) => handleUpdateField('subtitle', e.target.value)}
                      placeholder="e.g., Former Director-CBI, NHRC"
                      disabled={loading}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote" className="text-slate-300 text-sm">
                      Quote/Message
                    </Label>
                    <Textarea
                      id="quote"
                      value={resource.quote || ''}
                      onChange={(e) => handleUpdateField('quote', e.target.value)}
                      placeholder="Their testimonial or inspiring message..."
                      rows={3}
                      disabled={loading}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}

              {(resource.type === 'book' || resource.type === 'magazine') && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <h3 className="text-white font-semibold">
                      {resource.type === 'book' ? 'Book Details' : 'Magazine Details'}
                    </h3>
                  </div>
                  <DocumentUpload
                    document={downloadFile}
                    onDocumentChange={(doc) => {
                      setDownloadFile(doc);
                      handleUpdateField('downloadUrl', doc?.url || '');
                    }}
                    accept=".pdf"
                    maxSize={25 * 1024 * 1024} // 25MB
                  />
                </div>
              )}

              {(resource.type === 'link' || resource.type === 'blog') && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <LinkIcon className="h-5 w-5 text-blue-400" />
                    <h3 className="text-white font-semibold">
                      {resource.type === 'blog' ? 'Blog Details' : 'Link Details'}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkUrl" className="text-slate-300 text-sm">
                      URL <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="linkUrl"
                      value={resource.linkUrl || ''}
                      onChange={(e) => handleUpdateField('linkUrl', e.target.value)}
                      placeholder={resource.type === 'blog' ? 'https://your-blog.com/post' : 'https://example.com'}
                      disabled={loading}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-500">
                      {resource.type === 'blog'
                        ? 'Enter the URL where users can read this blog post'
                        : 'Enter the URL for this external link'}
                    </p>
                  </div>
                </div>
              )}

              {/* Common fields */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-300 text-sm">Category</Label>
                  <Input
                    id="category"
                    value={resource.category || ''}
                    onChange={(e) => handleUpdateField('category', e.target.value)}
                    placeholder="e.g., Meditation, Talks"
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-slate-300 text-sm">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={resource.order || 0}
                    onChange={(e) => handleUpdateField('order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Thumbnail Image (optional)</Label>
                <ImageUpload
                  images={thumbnailImages}
                  onImagesChange={(images) => {
                    setThumbnailImages(images);
                    handleUpdateField('thumbnailUrl', images.length > 0 ? images[0].url : '');
                  }}
                  maxImages={1}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/resources')}
              disabled={loading}
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Draft'}
            </Button>
            <Button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
