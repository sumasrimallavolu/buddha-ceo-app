'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, CalendarPlus, Save, Plus, X, Upload, User, GraduationCap, MapPin } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

interface Teacher {
  _id: string;
  name: string;
  specialization?: string;
  bio?: string;
}

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface DateSlot {
  date: string;
  startTime: string;
  endTime: string;
  title?: string;
}

export default function NewEventPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState({
    startDate: '',
    endDate: '',
    slots: [] as string[]
  });

  // Dynamic list fields
  const [benefits, setBenefits] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [whatToBring, setWhatToBring] = useState<string[]>(['']);
  const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);
  const [showDateSlots, setShowDateSlots] = useState(false);

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
    teacherId: '',
    teacherName: '',
    targetAudience: '',
    curriculum: '',
    price: '',
    currency: 'INR',
  });

  const userRole = session?.user?.role;
  const canEdit = userRole === 'admin' || userRole === 'content_manager';

  useEffect(() => {
    fetchTeachers();
  }, []);

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

  if (!canEdit) {
    router.push('/admin');
    return null;
  }

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

  // Date slot handlers
  const addDateSlot = () => {
    setShowDateSlots(true);
    setDateSlots([...dateSlots, { date: '', startTime: '', endTime: '', title: '' }]);
  };
  const removeDateSlot = (index: number) => {
    const newSlots = dateSlots.filter((_, i) => i !== index);
    setDateSlots(newSlots);
    // Hide section if no slots left
    if (newSlots.length === 0) {
      setShowDateSlots(false);
    }
  };
  const updateDateSlot = (index: number, field: keyof DateSlot, value: string) => {
    const newSlots = [...dateSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setDateSlots(newSlots);

    // Clear slot error when user updates the field
    if (fieldErrors.slots[index]) {
      const newSlotErrors = [...fieldErrors.slots];
      newSlotErrors[index] = '';
      setFieldErrors({ ...fieldErrors, slots: newSlotErrors });
    }

    // Validate end time after start time
    if (field === 'startTime' && newSlots[index].endTime) {
      if (value && newSlots[index].endTime && value >= newSlots[index].endTime) {
        const newSlotErrors = [...fieldErrors.slots];
        newSlotErrors[index] = 'End time must be after start time';
        setFieldErrors({ ...fieldErrors, slots: newSlotErrors });
      }
    }

    if (field === 'endTime' && newSlots[index].startTime) {
      if (newSlots[index].startTime && value && value <= newSlots[index].startTime) {
        const newSlotErrors = [...fieldErrors.slots];
        newSlotErrors[index] = 'End time must be after start time';
        setFieldErrors({ ...fieldErrors, slots: newSlotErrors });
      }
    }
  };

  const validateDates = () => {
    const errors = {
      startDate: '',
      endDate: '',
      slots: [] as string[]
    };
    let hasError = false;

    // Validate main dates
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
      hasError = true;
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
      hasError = true;
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end < start) {
        errors.endDate = 'End date must be on or after start date';
        hasError = true;
      }
    }

    // Validate date slots (only validate slots that have data)
    dateSlots.forEach((slot, index) => {
      // Skip validation for completely empty slots
      if (!slot.date && !slot.startTime && !slot.endTime) {
        return;
      }

      if (!slot.date) {
        errors.slots[index] = 'Date is required';
        hasError = true;
      } else {
        // Validate slot date is within event range
        if (formData.startDate && formData.endDate) {
          const slotDate = new Date(slot.date);
          const eventStart = new Date(formData.startDate);
          const eventEnd = new Date(formData.endDate);
          const eventStartDay = new Date(eventStart).setHours(0,0,0,0);
          const eventEndDay = new Date(eventEnd).setHours(23,59,59,999);

          if (slotDate.getTime() < eventStartDay || slotDate.getTime() > eventEndDay) {
            errors.slots[index] = 'Slot date must be within event date range';
            hasError = true;
          }
        }
      }

      if (!slot.startTime) {
        errors.slots[index] = errors.slots[index] || 'Start time is required';
        hasError = true;
      }

      if (!slot.endTime) {
        errors.slots[index] = errors.slots[index] || 'End time is required';
        hasError = true;
      }

      if (slot.startTime && slot.endTime) {
        if (slot.startTime >= slot.endTime) {
          errors.slots[index] = 'End time must be after start time';
          hasError = true;
        }
      }
    });

    setFieldErrors(errors);
    return !hasError;
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    setError('');
    setSuccess(false);

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    // Validate all dates
    if (!validateDates()) {
      setError('Please fix the date/time errors before submitting');
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
        location: {
          online: formData.locationOnline,
          venue: formData.locationVenue,
          city: formData.locationCity,
          state: formData.locationState,
          country: formData.locationCountry,
        },
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

      // Handle date slots intelligently
      const validSlots = dateSlots.filter(slot => slot.date.trim());
      if (validSlots.length > 0) {
        // User has added specific date slots - use those
        eventData.dateSlots = validSlots;
      } else {
        // No date slots added - auto-create from main start/end date
        // Parse the main dates and create a default slot
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        // If it's a single day event
        if (startDate.toDateString() === endDate.toDateString()) {
          eventData.dateSlots = [{
            date: startDate.toISOString().split('T')[0], // YYYY-MM-DD
            startTime: formData.startDate.split('T')[1] || '09:00',
            endTime: formData.endDate.split('T')[1] || '10:00',
            title: 'Main Session'
          }];
        }
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
        router.push('/admin/events');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Create New Event</h1>
          <p className="text-slate-400 text-sm">Add a new meditation program or event to your website</p>
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
          <AlertDescription>Event created successfully! Redirecting...</AlertDescription>
        </Alert>
      )}

      {/* Event Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { value: 'beginner_online', label: 'Beginner Online', desc: 'Online programs' },
          { value: 'beginner_physical', label: 'Beginner Physical', desc: 'In-person programs' },
          { value: 'advanced_online', label: 'Advanced Online', desc: 'Advanced online' },
          { value: 'advanced_physical', label: 'Advanced Physical', desc: 'Advanced in-person' },
          { value: 'conference', label: 'Conference', desc: 'Special events' },
        ].map((type) => {
          const Icon = CalendarPlus;
          const isSelected = formData.type === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => setFormData({ ...formData, type: type.value })}
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
              Event Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., 40-Day Meditation Program"
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Dates and Times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-slate-300 text-sm">
                Start Date <span className="text-red-400">*</span>
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                  // Clear error when user fixes it
                  if (fieldErrors.startDate) {
                    setFieldErrors({ ...fieldErrors, startDate: '' });
                  }
                  // Re-validate end date if it exists
                  if (formData.endDate && e.target.value) {
                    const start = new Date(e.target.value);
                    const end = new Date(formData.endDate);
                    if (end < start) {
                      setFieldErrors({
                        ...fieldErrors,
                        endDate: 'End date must be on or after start date'
                      });
                    } else if (fieldErrors.endDate) {
                      // Clear end date error if now valid
                      setFieldErrors({ ...fieldErrors, endDate: '' });
                    }
                  }
                }}
                disabled={loading}
                className={`bg-white/5 border-white/10 text-white ${
                  fieldErrors.startDate ? 'border-red-500' : formData.endDate && new Date(formData.endDate) >= new Date(formData.startDate) ? 'border-green-500/50' : ''
                }`}
              />
              {fieldErrors.startDate ? (
                <p className="text-xs text-red-400">{fieldErrors.startDate}</p>
              ) : formData.startDate && formData.endDate && new Date(formData.endDate) >= new Date(formData.startDate) && (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Valid date range
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-slate-300 text-sm">
                End Date <span className="text-red-400">*</span>
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                  // Clear error when user fixes it
                  if (fieldErrors.endDate) {
                    setFieldErrors({ ...fieldErrors, endDate: '' });
                  }
                  // Validate against start date
                  if (formData.startDate && e.target.value) {
                    const start = new Date(formData.startDate);
                    const end = new Date(e.target.value);
                    if (end < start) {
                      setFieldErrors({
                        ...fieldErrors,
                        endDate: 'End date must be on or after start date'
                      });
                    }
                  }
                }}
                disabled={loading}
                className={`bg-white/5 border-white/10 text-white ${
                  fieldErrors.endDate ? 'border-red-500' : formData.startDate && formData.endDate && new Date(formData.endDate) >= new Date(formData.startDate) ? 'border-green-500/50' : ''
                }`}
              />
              {fieldErrors.endDate ? (
                <p className="text-xs text-red-400">{fieldErrors.endDate}</p>
              ) : formData.startDate && formData.endDate && new Date(formData.endDate) >= new Date(formData.startDate) && (
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Valid date range
                </p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-slate-300 text-sm">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0 for free"
                disabled={loading}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-slate-300 text-sm">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
                disabled={loading}
              >
                <SelectTrigger id="currency" className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  <SelectItem value="INR" className="text-white">INR (₹)</SelectItem>
                  <SelectItem value="USD" className="text-white">USD ($)</SelectItem>
                  <SelectItem value="EUR" className="text-white">EUR (€)</SelectItem>
                  <SelectItem value="GBP" className="text-white">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date/Time Slots Section - Optional */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            {!showDateSlots ? (
              /* Collapsed state - just show button */
              <div className="flex items-center justify-between p-4 rounded-lg border border-dashed border-white/20 hover:border-white/30 transition-colors">
                <div className="flex items-center gap-3">
                  <CalendarPlus className="h-5 w-5 text-slate-400" />
                  <div>
                    <h3 className="text-white font-medium text-sm">Multiple Session Dates & Times</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Optional - for events with multiple sessions
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDateSlot}
                  disabled={loading}
                  className="h-8 border-white/10 text-slate-300 hover:bg-white/5"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Sessions
                </Button>
              </div>
            ) : (
              /* Expanded state - show all slots */
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarPlus className="h-5 w-5 text-blue-400" />
                    <div>
                      <h3 className="text-white font-semibold">Session Dates & Times</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Add multiple sessions for this event
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowDateSlots(false);
                        setDateSlots([]);
                      }}
                      disabled={loading}
                      className="h-8 text-slate-400 hover:text-white hover:bg-white/5"
                    >
                      Hide
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDateSlot}
                      disabled={loading}
                      className="h-8 border-white/10 text-slate-300 hover:bg-white/5"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time Slot
                    </Button>
                  </div>
                </div>

                {/* Empty state for slots */}
                {dateSlots.length === 0 && (
                  <div className="flex items-center gap-2 p-4 rounded-lg border border-dashed border-white/20">
                    <CalendarPlus className="h-5 w-5 text-slate-500" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-400">No time slots added yet</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Click "Add Time Slot" to create sessions for this event
                      </p>
                    </div>
                  </div>
                )}

                {/* Validation warning for date range */}
                {dateSlots.filter(slot => slot.date.trim()).length > 0 && formData.startDate && formData.endDate && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <CalendarPlus className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-yellow-300">
                        Event runs from {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})} to {new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}
                      </p>
                      <p className="text-xs text-yellow-400/70 mt-1">
                        All session dates must be within this range
                      </p>
                    </div>
                  </div>
                )}

                {/* Available dates info */}
                {formData.startDate && !fieldErrors.startDate && !fieldErrors.endDate && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <p className="text-xs text-green-300">
                      Session slots can be scheduled from {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to {new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {dateSlots.map((slot, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-slate-300 text-sm">Session {index + 1}</Label>
                            {formData.startDate && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                Available: {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} onwards
                              </p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDateSlot(index)}
                            disabled={loading}
                            className="h-8 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`slot-title-${index}`} className="text-slate-300 text-xs">
                            Session Title (Optional)
                          </Label>
                          <Input
                            id={`slot-title-${index}`}
                            value={slot.title}
                            onChange={(e) => updateDateSlot(index, 'title', e.target.value)}
                            placeholder="e.g., Opening Session, Morning Meditation"
                            disabled={loading}
                            className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor={`slot-date-${index}`} className="text-slate-300 text-xs">
                              Date <span className="text-red-400">*</span>
                            </Label>
                            <Input
                              id={`slot-date-${index}`}
                              type="date"
                              value={slot.date}
                              min={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : undefined}
                              onChange={(e) => updateDateSlot(index, 'date', e.target.value)}
                              disabled={loading}
                              className={`bg-white/5 border-white/10 text-white text-sm ${
                                fieldErrors.slots[index] ? 'border-red-500' : slot.date && formData.startDate && formData.endDate ? (() => {
                                  const slotDate = new Date(slot.date);
                                  const eventStart = new Date(formData.startDate);
                                  const eventEnd = new Date(formData.endDate);
                                  const eventStartDay = new Date(eventStart).setHours(0,0,0,0);
                                  const eventEndDay = new Date(eventEnd).setHours(23,59,59,999);
                                  return slotDate.getTime() >= eventStartDay && slotDate.getTime() <= eventEndDay ? 'border-green-500/50' : '';
                                })() : ''
                              }`}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`slot-start-${index}`} className="text-slate-300 text-xs">
                              Start Time <span className="text-red-400">*</span>
                            </Label>
                            <Input
                              id={`slot-start-${index}`}
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateDateSlot(index, 'startTime', e.target.value)}
                              disabled={loading}
                              className={`bg-white/5 border-white/10 text-white text-sm ${
                                fieldErrors.slots[index] && fieldErrors.slots[index].includes('time') ? 'border-red-500' : ''
                              }`}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`slot-end-${index}`} className="text-slate-300 text-xs">
                              End Time <span className="text-red-400">*</span>
                            </Label>
                            <Input
                              id={`slot-end-${index}`}
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateDateSlot(index, 'endTime', e.target.value)}
                              disabled={loading}
                              className={`bg-white/5 border-white/10 text-white text-sm ${
                                fieldErrors.slots[index] && fieldErrors.slots[index].includes('time') ? 'border-red-500' :
                                slot.startTime && slot.endTime && slot.endTime > slot.startTime ? 'border-green-500/50' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {/* Success message for valid slot */}
                        {!fieldErrors.slots[index] && slot.date && slot.startTime && slot.endTime && slot.endTime > slot.startTime && (
                          <p className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Valid session time
                          </p>
                        )}

                        {/* Error message for this slot */}
                        {fieldErrors.slots[index] && (
                          <p className="text-xs text-red-400">⚠️ {fieldErrors.slots[index]}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {dateSlots.filter(slot => slot.date.trim()).length > 0 && (
                  <p className="text-xs text-slate-500">
                    💡 You've added {dateSlots.filter(slot => slot.date.trim()).length} session slots. A session will be created for each slot.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Teacher Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-semibold">Event Teacher</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher" className="text-slate-300 text-sm">Select Teacher (Optional)</Label>
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
                disabled={loading}
              >
                <SelectTrigger id="teacher" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id} className="text-white">
                      {teacher.name} {teacher.specialization && `(${teacher.specialization})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-semibold">Event Details</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300 text-sm">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this event..."
                rows={3}
                disabled={loading}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-slate-300 text-sm">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g., This program is suitable for beginners with no prior meditation experience..."
                rows={2}
                disabled={loading}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="curriculum" className="text-slate-300 text-sm">Course Curriculum/Outline</Label>
              <Textarea
                id="curriculum"
                value={formData.curriculum}
                onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                placeholder="Week 1: Introduction to Meditation&#10;Week 2: Breathing Techniques&#10;Week 3: Mindfulness Practices..."
                rows={4}
                disabled={loading}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 whitespace-pre-wrap"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Event Image</Label>
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

          {/* Benefits Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-400" />
                <h3 className="text-white font-semibold">Benefits</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBenefit}
                disabled={loading}
                className="h-8 border-white/10 text-slate-300 hover:bg-white/5"
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
                    disabled={loading}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                  {benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                      disabled={loading}
                      className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-400" />
                <h3 className="text-white font-semibold">Requirements / Prerequisites</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
                disabled={loading}
                className="h-8 border-white/10 text-slate-300 hover:bg-white/5"
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
                    disabled={loading}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRequirement(index)}
                      disabled={loading}
                      className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What to Bring Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-400" />
                <h3 className="text-white font-semibold">What to Bring</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWhatToBring}
                disabled={loading}
                className="h-8 border-white/10 text-slate-300 hover:bg-white/5"
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
                    disabled={loading}
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                  {whatToBring.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWhatToBring(index)}
                      disabled={loading}
                      className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-950/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-semibold">Photo Gallery</h3>
              <span className="text-xs text-slate-500 ml-2">(Multiple images allowed)</span>
            </div>

            <ImageUpload
              images={galleryImages}
              onImagesChange={setGalleryImages}
              maxImages={10}
            />
          </div>

          {/* Registration */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-semibold">Registration</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationLink" className="text-slate-300 text-sm">Registration Link</Label>
                <Input
                  id="registrationLink"
                  value={formData.registrationLink}
                  onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                  placeholder="https://example.com/register"
                  disabled={loading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="text-slate-300 text-sm">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  placeholder="Unlimited"
                  disabled={loading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <h3 className="text-white font-semibold">Location Details</h3>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <Checkbox
                id="online"
                checked={formData.locationOnline}
                onCheckedChange={(checked) => setFormData({ ...formData, locationOnline: checked as boolean })}
                disabled={loading}
              />
              <div className="flex-1">
                <Label htmlFor="online" className="cursor-pointer text-white">Online Event</Label>
                <p className="text-xs text-slate-400 mt-1">Check if this event will be held online</p>
              </div>
            </div>

            {!formData.locationOnline && (
              <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="space-y-2">
                  <Label htmlFor="venue" className="text-slate-300 text-sm">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.locationVenue}
                    onChange={(e) => setFormData({ ...formData, locationVenue: e.target.value })}
                    placeholder="Venue name"
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-300 text-sm">City</Label>
                    <Input
                      id="city"
                      value={formData.locationCity}
                      onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                      placeholder="City"
                      disabled={loading}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-slate-300 text-sm">State</Label>
                    <Input
                      id="state"
                      value={formData.locationState}
                      onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
                      placeholder="State"
                      disabled={loading}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-slate-300 text-sm">Country</Label>
                  <Input
                    id="country"
                    value={formData.locationCountry}
                    onChange={(e) => setFormData({ ...formData, locationCountry: e.target.value })}
                    placeholder="Country"
                    disabled={loading}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            {formData.locationOnline && (
              <div className="space-y-2">
                <Label htmlFor="onlineLocation" className="text-slate-300 text-sm">Online Platform/Link</Label>
                <Input
                  id="onlineLocation"
                  value={formData.locationVenue}
                  onChange={(e) => setFormData({ ...formData, locationVenue: e.target.value })}
                  placeholder="e.g., Zoom, Google Meet, etc."
                  disabled={loading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/events')}
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
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Draft
        </Button>
        <Button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarPlus className="mr-2 h-4 w-4" />}
          Publish Event
        </Button>
      </div>
    </div>
  );
}
