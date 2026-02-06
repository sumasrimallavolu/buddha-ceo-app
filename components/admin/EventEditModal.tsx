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
import ImageUpload from './ImageUpload';

interface EventEditModalProps {
  eventId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EventEditModal({
  eventId,
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: EventEditModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value);
    } else {
      setOpen(value);
    }
  };

  const fetchEvent = async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/admin/events/${eventId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch event');
      }

      setEvent(data);

      if (data.imageUrl) {
        setUploadedImages([{ url: data.imageUrl, filename: '', size: 0, type: '' }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen && eventId) {
      fetchEvent();
      setError('');
      setSuccess(false);
    }
  }, [isOpen, eventId]);

  const handleUpdateField = (field: string, value: any) => {
    setEvent({
      ...event,
      [field]: value,
    });
  };

  const handleSubmit = async (saveAsDraft = false, autoPublish = false) => {
    if (!event.title || !event.startDate || !event.endDate) {
      setError('Title, start date, and end date are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const eventData: Record<string, any> = {
        title: event.title,
        type: event.type,
        description: event.description,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        timings: event.timings,
        status: saveAsDraft ? 'draft' : (autoPublish ? 'upcoming' : event.status),
        autoPublish,
        location: event.location || {},
      };

      if (event.imageUrl) {
        eventData.imageUrl = event.imageUrl;
      }

      if (event.registrationLink) {
        eventData.registrationLink = event.registrationLink;
      }

      if (event.maxParticipants) {
        eventData.maxParticipants = event.maxParticipants;
      }

      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update event');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
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
          <SheetTitle className="text-white">Edit Event</SheetTitle>
          <SheetDescription className="text-slate-400">
            Update event details
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
                Event updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {event && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={event.title}
                  onChange={(e) => handleUpdateField('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type *</Label>
                <Select
                  value={event.type}
                  onValueChange={(value) => handleUpdateField('type', value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner_online">Beginner Online Program</SelectItem>
                    <SelectItem value="beginner_physical">Beginner Physical Program</SelectItem>
                    <SelectItem value="advanced_online">Advanced Online Program</SelectItem>
                    <SelectItem value="advanced_physical">Advanced Physical Program</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={event.status}
                  onValueChange={(value) => handleUpdateField('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleUpdateField('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleUpdateField('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timings">Timings</Label>
                <Input
                  id="timings"
                  value={event.timings || ''}
                  onChange={(e) => handleUpdateField('timings', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={event.description || ''}
                  onChange={(e) => handleUpdateField('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Event Image</Label>
                <ImageUpload
                  images={uploadedImages}
                  onImagesChange={(images) => {
                    setUploadedImages(images);
                    if (images.length > 0) {
                      handleUpdateField('imageUrl', images[0].url);
                    }
                  }}
                  maxImages={1}
                />
                {uploadedImages.length === 0 && event.imageUrl && (
                  <img src={event.imageUrl} alt="Current" className="w-32 rounded" />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationLink">Registration Link</Label>
                <Input
                  id="registrationLink"
                  value={event.registrationLink || ''}
                  onChange={(e) => handleUpdateField('registrationLink', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={event.maxParticipants || ''}
                  onChange={(e) => handleUpdateField('maxParticipants', parseInt(e.target.value) || '')}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-4">Location Details</h3>

                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="online"
                    checked={event.location?.online || false}
                    onCheckedChange={(checked) =>
                      handleUpdateField('location', { ...event.location, online: checked })
                    }
                  />
                  <Label htmlFor="online">This is an online event</Label>
                </div>

                {event.location && !event.location.online && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={event.location.venue || ''}
                        onChange={(e) =>
                          handleUpdateField('location', { ...event.location, venue: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={event.location.city || ''}
                          onChange={(e) =>
                            handleUpdateField('location', { ...event.location, city: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={event.location.state || ''}
                          onChange={(e) =>
                            handleUpdateField('location', { ...event.location, state: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={event.location.country || ''}
                        onChange={(e) =>
                          handleUpdateField('location', { ...event.location, country: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
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
