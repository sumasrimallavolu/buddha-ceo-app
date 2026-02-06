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
import { Loader2, CheckCircle2, BookOpen, Save } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface ResourceCreateModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResourceCreateModal({
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: ResourceCreateModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    description: '',
    thumbnailUrl: '',
    downloadUrl: '',
    videoUrl: '',
    linkUrl: '',
    category: '',
    order: 0,
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

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'video',
      description: '',
      thumbnailUrl: '',
      downloadUrl: '',
      videoUrl: '',
      linkUrl: '',
      category: '',
      order: 0,
    });
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (saveAsDraft = false, autoPublish = false) => {
    setError('');
    setSuccess(false);

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      const resourceData: Record<string, any> = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        category: formData.category,
        order: formData.order,
        status: saveAsDraft ? 'draft' : 'published',
        autoPublish,
      };

      if (formData.thumbnailUrl) {
        resourceData.thumbnailUrl = formData.thumbnailUrl;
      }

      if (formData.type === 'book' || formData.type === 'magazine') {
        if (formData.downloadUrl) {
          resourceData.downloadUrl = formData.downloadUrl;
        }
      }

      if (formData.type === 'video' && formData.videoUrl) {
        resourceData.videoUrl = formData.videoUrl;
      }

      if (formData.type === 'link' && formData.linkUrl) {
        resourceData.linkUrl = formData.linkUrl;
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
        setIsOpen(false);
        resetForm();
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(value) => {
      setIsOpen(value);
      if (!value) resetForm();
    }}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-slate-950 border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white">Create New Resource</SheetTitle>
          <SheetDescription className="text-slate-400">
            Add a new book, video, magazine, or link
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-8 px-6 space-y-8">
          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Resource created successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
              <h3 className="text-sm font-semibold text-white">Basic Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Resource title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-slate-300">Resource Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="magazine">Magazine</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-300">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Teachings, Meditation Techniques, Talks"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this resource..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" />
              <h3 className="text-sm font-semibold text-white">Media Details</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl" className="text-slate-300">Thumbnail Image URL</Label>
                <Input
                  id="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {formData.type === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-slate-300">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              )}

              {(formData.type === 'book' || formData.type === 'magazine') && (
                <div className="space-y-2">
                  <Label htmlFor="downloadUrl" className="text-slate-300">Download/Purchase URL</Label>
                  <Input
                    id="downloadUrl"
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                    placeholder="https://example.com/resource.pdf"
                  />
                </div>
              )}

              {formData.type === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="linkUrl" className="text-slate-300">Link URL</Label>
                  <Input
                    id="linkUrl"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="order" className="text-slate-300">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-slate-500">Lower numbers appear first</p>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="flex-col gap-3 sm:flex-row border-t border-white/10 pt-6 px-6 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading || success}
            className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(true, false)}
            disabled={loading || success}
            className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
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
            className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-blue-500/25"
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
                <BookOpen className="mr-2 h-4 w-4" />
                Publish Now
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
