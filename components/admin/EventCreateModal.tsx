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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, CheckCircle2, CalendarPlus, Save } from 'lucide-react';
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

interface EventCreateModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EventCreateModal({
  trigger,
  onSuccess,
  open: controlledOpen,
  onOpenChange,
}: EventCreateModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'beginner_online',
    description: '',
    startDate: '',
    endDate: '',
    timings: '',
    imageUrl: '',
    registrationLink: '',
    maxParticipants: '',
    locationOnline: true,
    locationVenue: '',
    locationCity: '',
    locationState: '',
    locationCountry: '',
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
      type: 'beginner_online',
      description: '',
      startDate: '',
      endDate: '',
      timings: '',
      imageUrl: '',
      registrationLink: '',
      maxParticipants: '',
      locationOnline: true,
      locationVenue: '',
      locationCity: '',
      locationState: '',
      locationCountry: '',
    });
    setUploadedImages([]);
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (saveAsDraft = false, autoPublish = false) => {
    setError('');
    setSuccess(false);

    if (!formData.title || !formData.startDate || !formData.endDate) {
      setError('Title, start date, and end date are required');
      return;
    }

    setLoading(true);

    try {
      const eventData: Record<string, any> = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        timings: formData.timings,
        status: saveAsDraft ? 'draft' : 'upcoming',
        autoPublish,
        location: {
          online: formData.locationOnline,
          venue: formData.locationVenue,
          city: formData.locationCity,
          state: formData.locationState,
          country: formData.locationCountry,
        },
      };

      if (formData.imageUrl) {
        eventData.imageUrl = formData.imageUrl;
      } else if (uploadedImages.length > 0) {
        eventData.imageUrl = uploadedImages[0].url;
      }

      if (formData.registrationLink) {
        eventData.registrationLink = formData.registrationLink;
      }

      if (formData.maxParticipants) {
        eventData.maxParticipants = parseInt(formData.maxParticipants);
        eventData.currentRegistrations = 0;
      }

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        resetForm();
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(value) => {
      setIsOpen(value);
      if (!value) resetForm();
    }}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Add a new meditation program or event
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
                Event created successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., 40-Day Meditation Program"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Event Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timings">Timings</Label>
            <Input
              id="timings"
              value={formData.timings}
              onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
              placeholder="e.g., 7:00 to 8:00 AM IST | 8:30 to 9:30 PM US ET"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  setFormData({ ...formData, imageUrl: images[0].url });
                }
              }}
              maxImages={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationLink">Registration Link (Optional)</Label>
            <Input
              id="registrationLink"
              value={formData.registrationLink}
              onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
              placeholder="https://example.com/register"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Maximum Participants (Optional)</Label>
            <Input
              id="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-4">Location Details</h3>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="online"
                checked={formData.locationOnline}
                onCheckedChange={(checked) => setFormData({ ...formData, locationOnline: checked as boolean })}
              />
              <Label htmlFor="online">This is an online event</Label>
            </div>

            {!formData.locationOnline && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.locationVenue}
                    onChange={(e) => setFormData({ ...formData, locationVenue: e.target.value })}
                    placeholder="Venue name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.locationCity}
                      onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.locationState}
                      onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.locationCountry}
                    onChange={(e) => setFormData({ ...formData, locationCountry: e.target.value })}
                    placeholder="Country"
                  />
                </div>
              </div>
            )}

            {formData.locationOnline && (
              <div className="space-y-2">
                <Label htmlFor="onlineLocation">Online Platform/Link</Label>
                <Input
                  id="onlineLocation"
                  value={formData.locationVenue}
                  onChange={(e) => setFormData({ ...formData, locationVenue: e.target.value })}
                  placeholder="e.g., Zoom, Google Meet, etc."
                />
              </div>
            )}
          </div>
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
                <CalendarPlus className="mr-2 h-4 w-4" />
                Publish Now
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
