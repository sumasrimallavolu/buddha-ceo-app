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
import { Loader2, CheckCircle2, Edit, Save } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface ResourceEditModalProps {
  resourceId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResourceEditModal({
  resourceId,
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: ResourceEditModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resource, setResource] = useState<any>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value);
    } else {
      setOpen(value);
    }
  };

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
    if (isOpen && resourceId) {
      fetchResource();
      setError('');
      setSuccess(false);
    }
  }, [isOpen, resourceId]);

  const handleUpdateField = (field: string, value: any) => {
    setResource({
      ...resource,
      [field]: value,
    });
  };

  const handleSubmit = async (saveAsDraft = false, autoPublish = false) => {
    if (!resource.title) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const resourceData = {
        ...resource,
        status: saveAsDraft ? 'draft' : (autoPublish ? 'published' : resource.status),
        autoPublish,
      };

      const response = await fetch(`/api/admin/resources/${resourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resourceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update resource');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resource');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent side="right" className="w-full sm:max-w-2xl bg-slate-950 border-white/10">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-slate-950 border-white/10 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Edit Resource</SheetTitle>
          <SheetDescription className="text-slate-400">
            Update resource details
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-8 px-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Resource updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {resource && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={resource.title}
                  onChange={(e) => handleUpdateField('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Resource Type *</Label>
                <Select
                  value={resource.type}
                  onValueChange={(value) => handleUpdateField('type', value)}
                  disabled
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="magazine">Magazine</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Resource type cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={resource.category || ''}
                  onChange={(e) => handleUpdateField('category', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={resource.description || ''}
                  onChange={(e) => handleUpdateField('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail Image URL</Label>
                <Input
                  id="thumbnailUrl"
                  value={resource.thumbnailUrl || ''}
                  onChange={(e) => handleUpdateField('thumbnailUrl', e.target.value)}
                />
              </div>

              {resource.type === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={resource.videoUrl || ''}
                    onChange={(e) => handleUpdateField('videoUrl', e.target.value)}
                  />
                </div>
              )}

              {(resource.type === 'book' || resource.type === 'magazine') && (
                <div className="space-y-2">
                  <Label htmlFor="downloadUrl">Download/Purchase URL</Label>
                  <Input
                    id="downloadUrl"
                    value={resource.downloadUrl || ''}
                    onChange={(e) => handleUpdateField('downloadUrl', e.target.value)}
                  />
                </div>
              )}

              {resource.type === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="linkUrl">Link URL</Label>
                  <Input
                    id="linkUrl"
                    value={resource.linkUrl || ''}
                    onChange={(e) => handleUpdateField('linkUrl', e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={resource.order || 0}
                  onChange={(e) => handleUpdateField('order', parseInt(e.target.value) || 0)}
                />
                <p className="text-sm text-gray-500">Lower numbers appear first</p>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="gap-3 pt-6 px-6">
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
            onClick={() => handleSubmit(true, false)}
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
            className="bg-green-600"
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
                <Edit className="mr-2 h-4 w-4" />
                Publish Now
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
