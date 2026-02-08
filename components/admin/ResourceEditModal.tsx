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
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2, BookOpen, Video, FileText, Link as LinkIcon, Quote, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResourceEditModalProps {
  resourceId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ResourceEditModal({
  resourceId,
  trigger,
  onSuccess,
}: ResourceEditModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resource, setResource] = useState<any>(null);

  const fetchResource = async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/admin/resources/${resourceId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch resource');
      }

      setResource(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resource');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (open && resourceId) {
      fetchResource();
      setError('');
      setSuccess(false);
    }
  }, [open, resourceId]);

  const handleUpdateField = (field: string, value: any) => {
    setResource({
      ...resource,
      [field]: value
    });
  };

  const handleSubmit = async (saveAsDraft = false) => {
    if (!resource?.title) {
      setError('Title is required');
      return;
    }

    // For testimonials, quote is required instead of description
    if (resource.type === 'testimonial' && !resource.quote?.trim()) {
      setError('Quote is required for testimonials');
      return;
    }

    // For non-testimonials, description is required
    if (resource.type !== 'testimonial' && !resource.description?.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const resourceData = {
        ...resource,
        status: saveAsDraft ? 'draft' : 'published',
      };

      const response = await fetch(`/api/admin/resources/${resourceId}`, {
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
        setOpen(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resource');
    } finally {
      setLoading(false);
    }
  };

  if (!trigger) return null;

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 rounded-2xl border border-white/10 shadow-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">Edit Resource</h1>
                <p className="text-slate-400 text-sm">Update resource details</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setOpen(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {fetching ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {error && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>Resource updated successfully!</AlertDescription>
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
                          {resource.type === 'link' && <LinkIcon className="h-4 w-4" />}
                          {resource.type === 'testimonial' && <Quote className="h-4 w-4" />}
                          <span className="capitalize">{resource.type === 'testimonial' ? 'Testimonial' : resource.type}</span>
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

                          {/* Description (not for testimonials) */}
                          {resource.type !== 'testimonial' && (
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

                          {/* Type-specific fields */}
                          {resource.type === 'video' && (
                            <div className="space-y-4 pt-4 border-t border-white/10">
                              <div className="flex items-center gap-2 mb-4">
                                <Video className="h-5 w-5 text-blue-400" />
                                <h3 className="text-white font-semibold">Video Details</h3>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="videoUrl" className="text-slate-300 text-sm">
                                  Video URL <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                  id="videoUrl"
                                  value={resource.videoUrl || ''}
                                  onChange={(e) => handleUpdateField('videoUrl', e.target.value)}
                                  placeholder="https://youtube.com/watch?v=..."
                                  disabled={loading}
                                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                />
                              </div>
                            </div>
                          )}

                          {resource.type === 'testimonial' && (
                            <div className="space-y-4 pt-4 border-t border-white/10">
                              <div className="flex items-center gap-2 mb-4">
                                <Quote className="h-5 w-5 text-blue-400" />
                                <h3 className="text-white font-semibold">Testimonial Details</h3>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="videoUrl" className="text-slate-300 text-sm">
                                  Video URL <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                  id="videoUrl"
                                  value={resource.videoUrl || ''}
                                  onChange={(e) => handleUpdateField('videoUrl', e.target.value)}
                                  placeholder="https://youtube.com/watch?v=..."
                                  disabled={loading}
                                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="subtitle" className="text-slate-300 text-sm">
                                  Subtitle/Role <span className="text-red-400">*</span>
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
                                  Quote/Message <span className="text-red-400">*</span>
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
                              <div className="space-y-2">
                                <Label htmlFor="downloadUrl" className="text-slate-300 text-sm">
                                  Download/Purchase URL <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                  id="downloadUrl"
                                  value={resource.downloadUrl || ''}
                                  onChange={(e) => handleUpdateField('downloadUrl', e.target.value)}
                                  placeholder="https://example.com/resource.pdf"
                                  disabled={loading}
                                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                />
                              </div>
                            </div>
                          )}

                          {resource.type === 'link' && (
                            <div className="space-y-4 pt-4 border-t border-white/10">
                              <div className="flex items-center gap-2 mb-4">
                                <LinkIcon className="h-5 w-5 text-blue-400" />
                                <h3 className="text-white font-semibold">Link Details</h3>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="linkUrl" className="text-slate-300 text-sm">
                                  URL <span className="text-red-400">*</span>
                                </Label>
                                <Input
                                  id="linkUrl"
                                  value={resource.linkUrl || ''}
                                  onChange={(e) => handleUpdateField('linkUrl', e.target.value)}
                                  placeholder="https://example.com"
                                  disabled={loading}
                                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                                />
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
                            <Label htmlFor="thumbnailUrl" className="text-slate-300 text-sm">Thumbnail URL (optional)</Label>
                            <Input
                              id="thumbnailUrl"
                              value={resource.thumbnailUrl || ''}
                              onChange={(e) => handleUpdateField('thumbnailUrl', e.target.value)}
                              placeholder="https://example.com/thumbnail.jpg"
                              disabled={loading}
                              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end p-6 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
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
        </div>
      )}
    </>
  );
}
