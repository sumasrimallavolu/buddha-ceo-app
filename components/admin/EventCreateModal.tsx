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
import { Loader2, CheckCircle2, CalendarPlus, Save, Plus, X, Upload, User, GraduationCap } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import ImageUpload from './ImageUpload';

interface EventCreateModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface Teacher {
  _id: string;
  name: string;
  specialization?: string;
  bio?: string;
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
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Dynamic list fields
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [whatToBring, setWhatToBring] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    title: '',
    type: 'beginner_online',
    description: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    registrationLink: '',
    maxParticipants: '',
    locationOnline: true,
    locationVenue: '',
    locationCity: '',
    locationState: '',
    locationCountry: '',
    // New fields
    teacherId: '',
    teacherName: '',
    targetAudience: '',
    curriculum: '',
    price: '',
    currency: 'INR',
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

  // Fetch teachers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
    }
  }, [isOpen]);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/admin/teachers');
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers || []);
      }
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'beginner_online',
      description: '',
      startDate: '',
      endDate: '',
        imageUrl: '',
      registrationLink: '',
      maxParticipants: '',
      locationOnline: true,
      locationVenue: '',
      locationCity: '',
      locationState: '',
      locationCountry: '',
      teacherId: '',
      teacherName: '',
      targetAudience: '',
      curriculum: '',
      price: '',
      currency: 'INR',
    });
    setUploadedImages([]);
    setGalleryImages([]);
    setBenefits(['']);
    setRequirements(['']);
    setWhatToBring(['']);
    setError('');
    setSuccess(false);
  };

  // Dynamic list handlers
  const addBenefit = () => setBenefits([...benefits, '']);
  const removeBenefit = (index: number) => setBenefits(benefits.filter((_, i) => i !== index));
  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
  };

  const addRequirement = () => setRequirements([...requirements, '']);
  const removeRequirement = (index: number) => setRequirements(requirements.filter((_, i) => i !== index));
  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addWhatToBring = () => setWhatToBring([...whatToBring, '']);
  const removeWhatToBring = (index: number) => setWhatToBring(whatToBring.filter((_, i) => i !== index));
  const updateWhatToBring = (index: number, value: string) => {
    const newItems = [...whatToBring];
    newItems[index] = value;
    setWhatToBring(newItems);
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
        status: saveAsDraft ? 'draft' : 'upcoming',
        autoPublish,
        location: {
          online: formData.locationOnline,
          venue: formData.locationVenue,
          city: formData.locationCity,
          state: formData.locationState,
          country: formData.locationCountry,
        },
        // Enhanced fields
        benefits: benefits.filter(b => b.trim()),
        requirements: requirements.filter(r => r.trim()),
        whatToBring: whatToBring.filter(w => w.trim()),
        galleryImages: galleryImages.map(img => img.url),
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

      // Add enhanced fields
      if (formData.teacherId) {
        eventData.teacherId = formData.teacherId;
        const teacher = teachers.find(t => t._id === formData.teacherId);
        eventData.teacherName = teacher?.name || formData.teacherName;
      }

      if (formData.targetAudience) {
        eventData.targetAudience = formData.targetAudience;
      }

      if (formData.curriculum) {
        eventData.curriculum = formData.curriculum;
      }

      if (formData.price) {
        eventData.price = parseFloat(formData.price);
      }

      if (formData.currency) {
        eventData.currency = formData.currency;
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
    <Sheet open={isOpen} onOpenChange={(value) => {
      setIsOpen(value);
      if (!value) resetForm();
    }}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="right" className="w-full sm:max-w-3xl bg-slate-900 border-white/10 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Create New Event</SheetTitle>
          <SheetDescription className="text-slate-400">
            Add a new meditation program or event with detailed information
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Event created successfully!
              </AlertDescription>
            </Alert>
          )}

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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 40-Day Meditation Program"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type <span className="text-red-600">*</span></Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select event type" />
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
                  <Label htmlFor="startDate">Start Date <span className="text-red-600">*</span></Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date <span className="text-red-600">*</span></Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0 for free"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Selection */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
              <User className="inline h-4 w-4 mr-2" />
              Event Teacher
            </h3>

            <div className="space-y-2">
              <Label htmlFor="teacher">Select Teacher</Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => {
                  const teacher = teachers.find(t => t._id === value);
                  setFormData({
                    ...formData,
                    teacherId: value,
                    teacherName: teacher?.name || ''
                  });
                }}
              >
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Select a teacher (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.name} {teacher.specialization && `(${teacher.specialization})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this event..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Textarea
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g., This program is suitable for beginners with no prior meditation experience..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="curriculum">Course Curriculum/Outline</Label>
                <Textarea
                  id="curriculum"
                  value={formData.curriculum}
                  onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                  placeholder="Week 1: Introduction to Meditation&#10;Week 2: Breathing Techniques&#10;Week 3: Mindfulness Practices..."
                  rows={4}
                  className="whitespace-pre-wrap"
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
            </div>
          </div>

          {/* Benefits Section - Dynamic List */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                Benefits
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBenefit}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Benefit
              </Button>
            </div>

            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder={`Benefit ${index + 1}`}
                    className="flex-1"
                  />
                  {benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                      className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Section - Dynamic List */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                <GraduationCap className="inline h-4 w-4 mr-2" />
                Requirements / Prerequisites
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Requirement
              </Button>
            </div>

            <div className="space-y-2">
              {requirements.map((req, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    className="flex-1"
                  />
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                      className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What to Bring Section - Dynamic List */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                What to Bring
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWhatToBring}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-2">
              {whatToBring.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateWhatToBring(index, e.target.value)}
                    placeholder={`Item ${index + 1}`}
                    className="flex-1"
                  />
                  {whatToBring.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWhatToBring(index)}
                      className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                <Upload className="inline h-4 w-4 mr-2" />
                Photo Gallery
              </h3>
              <span className="text-xs text-gray-500">Multiple images allowed</span>
            </div>

            <ImageUpload
              images={galleryImages}
              onImagesChange={setGalleryImages}
              maxImages={10}
            />
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
                  value={formData.registrationLink}
                  onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                  placeholder="https://example.com/register"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
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
                  checked={formData.locationOnline}
                  onCheckedChange={(checked) => setFormData({ ...formData, locationOnline: checked as boolean })}
                />
                <div className="flex-1">
                  <Label htmlFor="online" className="cursor-pointer text-gray-900 dark:text-gray-100">Online Event</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check if this event will be held online</p>
                </div>
              </div>

              {!formData.locationOnline && (
                <div className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
                <CalendarPlus className="mr-2 h-4 w-4" />
                Publish Now
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
