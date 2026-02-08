'use client';

import { useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2, BookOpen, Video, FileText, Link as LinkIcon, Quote, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ResourceCreateModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ResourceCreateModal({
  trigger,
  onSuccess,
}: ResourceCreateModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [resourceType, setResourceType] = useState<string>('video');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    downloadUrl: '',
    videoUrl: '',
    linkUrl: '',
    category: '',
    order: 0,
    // Testimonial-specific fields
    subtitle: '',
    quote: '',
  });

  const resetForm = () => {
    setResourceType('video');
    setFormData({
      title: '',
      description: '',
      thumbnailUrl: '',
      downloadUrl: '',
      videoUrl: '',
      linkUrl: '',
      category: '',
      order: 0,
      subtitle: '',
      quote: '',
    });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (saveAsDraft = false) => {
    setError('');
    setSuccess(false);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    // For testimonials, quote is required instead of description
    if (resourceType === 'testimonial' && !formData.quote.trim()) {
      setError('Quote is required for testimonials');
      return;
    }

    // For non-testimonials, description is required
    if (resourceType !== 'testimonial' && !formData.description.trim()) {
      setError('Description is required');
      return;
    }

    // For videos and testimonials, videoUrl is required
    if ((resourceType === 'video' || resourceType === 'testimonial') && !formData.videoUrl.trim()) {
      setError('Video URL is required');
      return;
    }

    setLoading(true);

    try {
      const resourceData: Record<string, any> = {
        title: formData.title.trim(),
        type: resourceType,
        category: formData.category || 'General',
        order: formData.order,
        status: saveAsDraft ? 'draft' : 'published',
      };

      if (formData.description.trim()) {
        resourceData.description = formData.description.trim();
      }

      if (formData.thumbnailUrl) {
        resourceData.thumbnailUrl = formData.thumbnailUrl;
      }

      if (resourceType === 'book' || resourceType === 'magazine') {
        if (formData.downloadUrl) {
          resourceData.downloadUrl = formData.downloadUrl;
        }
      }

      if (resourceType === 'video') {
        if (formData.videoUrl) {
          resourceData.videoUrl = formData.videoUrl;
        }
      }

      if (resourceType === 'link') {
        if (formData.linkUrl) {
          resourceData.linkUrl = formData.linkUrl;
        }
      }

      if (resourceType === 'testimonial') {
        if (formData.videoUrl) {
          resourceData.videoUrl = formData.videoUrl;
        }
        if (formData.subtitle) {
          resourceData.subtitle = formData.subtitle;
        }
        if (formData.quote) {
          resourceData.quote = formData.quote;
        }
      }

      const response = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create resource');
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        resetForm();
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource');
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
                <h1 className="text-2xl font-bold text-white">Create New Resource</h1>
                <p className="text-slate-400 text-sm">Add books, videos, magazines, links, or testimonials</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>Resource created successfully!</AlertDescription>
                </Alert>
              )}

              {/* Resource Type Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { value: 'video', label: 'Video', icon: Video, desc: 'YouTube videos' },
                  { value: 'book', label: 'Book', icon: BookOpen, desc: 'PDF downloads' },
                  { value: 'magazine', label: 'Magazine', icon: FileText, desc: 'Publications' },
                  { value: 'link', label: 'Link', icon: LinkIcon, desc: 'External links' },
                  { value: 'testimonial', label: 'Testimonial', icon: Quote, desc: 'Video testimonials' },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = resourceType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setResourceType(type.value)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      <div className={`font-semibold mb-1 text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {type.label}
                      </div>
                      <div className="text-xs text-slate-400">{type.desc}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-blue-500 text-white text-xs">Selected</Badge>
                        </div>
                      )}
                    </button>
                  );
                })}
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
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Resource title"
                      disabled={loading}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>

                  {/* Description (not for testimonials) */}
                  {resourceType !== 'testimonial' && (
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-slate-300 text-sm">
                        Description <span className="text-red-400">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe this resource..."
                        rows={3}
                        disabled={loading}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                    </div>
                  )}

                  {/* Video/Book/Link/Testimonial specific fields */}
                  {(resourceType === 'video' || resourceType === 'testimonial') && (
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
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          placeholder="https://youtube.com/watch?v=..."
                          disabled={loading}
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        />
                      </div>

                      {resourceType === 'testimonial' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="subtitle" className="text-slate-300 text-sm">
                              Subtitle/Role <span className="text-red-400">*</span>
                            </Label>
                            <Input
                              id="subtitle"
                              value={formData.subtitle}
                              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
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
                              value={formData.quote}
                              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                              placeholder="Their testimonial or inspiring message..."
                              rows={3}
                              disabled={loading}
                              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {(resourceType === 'book' || resourceType === 'magazine') && (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <BookOpen className="h-5 w-5 text-blue-400" />
                        <h3 className="text-white font-semibold">
                          {resourceType === 'book' ? 'Book Details' : 'Magazine Details'}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="downloadUrl" className="text-slate-300 text-sm">
                          Download/Purchase URL <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="downloadUrl"
                          value={formData.downloadUrl}
                          onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                          placeholder="https://example.com/resource.pdf"
                          disabled={loading}
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                  )}

                  {resourceType === 'link' && (
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
                          value={formData.linkUrl}
                          onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
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
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://example.com/thumbnail.jpg"
                      disabled={loading}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end p-6 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
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
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
