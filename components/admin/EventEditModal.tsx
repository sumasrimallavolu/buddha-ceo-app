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
        <SheetContent side="right" className="w-full sm:max-w-2xl bg-slate-900 border-white/10">
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
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-slate-900 border-white/10 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Edit Event</SheetTitle>
          <SheetDescription className="text-slate-400">
            Update event details
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Event updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {event && (
            <>
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title <span className="text-red-600">*</span></Label>
                <Input
                  id="title"
                  value={event.title}
                  onChange={(e) => handleUpdateField('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type <span className="text-red-600">*</span></Label>
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
                  <Label htmlFor="startDate">Start Date <span className="text-red-600">*</span></Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleUpdateField('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date <span className="text-red-600">*</span></Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleUpdateField('endDate', e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Event Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={event.description || ''}
                  onChange={(e) => handleUpdateField('description', e.target.value)}
                  placeholder="Describe this event..."
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
            </div>
          </div>

          {/* Registration */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Registration
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="registrationLink">Registration Link</Label>
                <Input
                  id="registrationLink"
                  value={event.registrationLink || ''}
                  onChange={(e) => handleUpdateField('registrationLink', e.target.value)}
                  placeholder="https://example.com/register"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={event.maxParticipants || ''}
                  onChange={(e) => handleUpdateField('maxParticipants', parseInt(e.target.value) || '')}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              Location Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Checkbox
                  id="online"
                    checked={event.location?.online || false}
                    onCheckedChange={(checked) =>
                      handleUpdateField('location', { ...event.location, online: checked })
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor="online" className="cursor-pointer text-gray-900 dark:text-gray-100">Online Event</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check if this event will be held online</p>
                  </div>
                </div>

                {event.location && !event.location.online && (
                  <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue</Label>
                      <Input
                        id="venue"
                        value={event.location.venue || ''}
                        onChange={(e) =>
                          handleUpdateField('location', { ...event.location, venue: e.target.value })
                        }
                        placeholder="Venue name"
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
                          placeholder="City"
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
                          placeholder="State"
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
                        placeholder="Country"
                      />
                    </div>
                  </div>
                )}

                {event.location && event.location.online && (
                  <div className="space-y-2">
                    <Label htmlFor="onlineLocation">Online Platform/Link</Label>
                    <Input
                      id="onlineLocation"
                      value={event.location.venue || ''}
                      onChange={(e) =>
                        handleUpdateField('location', { ...event.location, venue: e.target.value })
                      }
                      placeholder="e.g., Zoom, Google Meet, etc."
                    />
                  </div>
                )}
            </div>
          </div>
        </>
          )}
        </div>

        <SheetFooter className="flex-col gap-3 sm:flex-row border-t border-gray-200 dark:border-gray-700 pt-6">
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
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
