'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Loader2,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  MapPin,
  GraduationCap,
  ArrowLeft,
  User,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  city: z.string().optional(),
  profession: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  currentRegistrations: number;
  imageUrl?: string;
  location?: {
    online?: boolean;
    venue?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  benefits?: string[];
  requirements?: string[];
  whatToBring?: string[];
  teacherName?: string;
  targetAudience?: string;
  price?: number;
  currency?: string;
}

export default function EventRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      city: '',
      profession: '',
    },
  });

  useEffect(() => {
    checkExistingRegistration();
    fetchEvent();
  }, []);

  const checkExistingRegistration = () => {
    const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    if (registeredEvents.includes(params.id)) {
      setAlreadyRegistered(true);
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/public/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);

        // Check if registration is closed (30 minutes before end time)
        const now = new Date();
        const eventEndTime = new Date(data.endDate);
        const registrationCloseTime = new Date(eventEndTime.getTime() - 30 * 60 * 1000); // 30 minutes before end
        if (now >= registrationCloseTime) {
          setRegistrationClosed(true);
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Event not found',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to load event details',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    setSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch(`/api/events/${params.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Store registration in localStorage
      const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
      if (!registeredEvents.includes(params.id)) {
        registeredEvents.push(params.id);
        localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
      }

      setSubmitStatus({
        type: 'success',
        message: `Successfully registered for ${event?.title}! We'll send you more details shortly.`,
      });

      setAlreadyRegistered(true);

      form.reset();
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(new Date(date));
  };

  const availableSlots = event?.maxParticipants
    ? event.maxParticipants - event.currentRegistrations
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-slate-400 mb-6">The event you're looking for doesn't exist.</p>
          <Link href="/events">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/events">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">Event Registration</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Event Details - Left Column */}
          <div className="space-y-6">
            {/* Event Hero Card */}
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
              {event.imageUrl && (
                <div className="relative h-64 w-full">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                </div>
              )}

              <div className="p-6 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                  <p className="text-slate-400 line-clamp-3">{event.description}</p>
                </div>

                {/* Event Meta */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Start Date</p>
                      <p className="text-sm text-white">{formatDate(event.startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Duration</p>
                      <p className="text-sm text-white">
                        {formatTime(event.startDate)} - {formatTime(event.endDate)}
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Location</p>
                        <p className="text-sm text-white">
                          {event.location.online ? 'Online Event' : (
                            <>
                              {event.location.venue && <span>{event.location.venue}</span>}
                              {event.location.city && <span>, {event.location.city}</span>}
                              {event.location.state && <span>, {event.location.state}</span>}
                              {event.location.country && <span>, {event.location.country}</span>}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {availableSlots !== null && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Availability</p>
                        <p className="text-sm">
                          {availableSlots > 0 ? (
                            <span className="text-green-400 font-medium">
                              {availableSlots} slots remaining
                            </span>
                          ) : (
                            <span className="text-red-400 font-medium">
                              Fully booked
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">
                          {event.currentRegistrations} / {event.maxParticipants} registered
                        </p>
                      </div>
                    </div>
                  )}

                  {event.price !== undefined && (
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Price</p>
                        <p className="text-sm text-white font-medium">
                          {event.price === 0 ? 'Free' : `${event.currency} ${event.price}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            {(event.benefits || event.requirements || event.whatToBring || event.teacherName) && (
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white">Event Details</h2>

                {event.teacherName && (
                  <div>
                    <h3 className="text-sm font-medium text-blue-400 mb-2">Teacher / Facilitator</h3>
                    <p className="text-white">{event.teacherName}</p>
                  </div>
                )}

                {event.targetAudience && (
                  <div>
                    <h3 className="text-sm font-medium text-blue-400 mb-2">Who Should Attend</h3>
                    <p className="text-slate-300 text-sm">{event.targetAudience}</p>
                  </div>
                )}

                {event.benefits && event.benefits.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-blue-400 mb-2">What You'll Learn</h3>
                    <ul className="space-y-1">
                      {event.benefits.map((benefit, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.requirements && event.requirements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-blue-400 mb-2">Requirements</h3>
                    <ul className="space-y-1">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.whatToBring && event.whatToBring.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-blue-400 mb-2">What to Bring</h3>
                    <ul className="space-y-1">
                      {event.whatToBring.map((item, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Registration Form / Already Registered - Right Column */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 lg:p-8">
              <div className="mb-6">
                {alreadyRegistered ? (
                  <>
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-green-400" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                      You are Already Registered!
                    </h2>
                    <p className="text-slate-400 text-sm text-center">
                      You have successfully registered for {event.title}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-2">Register Now</h2>
                    <p className="text-slate-400 text-sm">
                      Fill in your details to secure your spot
                    </p>
                  </>
                )}
              </div>

              {alreadyRegistered ? (
                <div className="space-y-4">
                  <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-white font-semibold mb-1">
                          Registration Confirmed
                        </h3>
                        <p className="text-slate-400 text-sm">
                          We have received your registration and will send you event
                          details and reminders closer to the date.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-white font-semibold mb-1">
                          Mark Your Calendar
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {event && formatDate(event.startDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sign Up Prompt Section */}
                  <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/30 p-6">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-violet-500/20 mb-4">
                        <User className="h-6 w-6 text-violet-400" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        Create an Account to Track Your Registrations
                      </h3>
                      <p className="text-slate-400 text-sm">
                        Sign up or sign in to view all your registered events, manage bookings, and receive updates.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link href="/signup" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-12 border-2 border-white/20 text-white hover:bg-white/5 hover:border-violet-400 transition-all"
                        >
                          Sign Up
                        </Button>
                      </Link>
                      <Link href="/login" className="flex-1">
                        <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25 transition-all">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : registrationClosed ? (
                <div className="space-y-4">
                  <div className="rounded-xl bg-orange-500/10 border border-orange-500/30 p-6">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-white font-semibold mb-1">
                          Registration Closed
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Registration for this event has closed as it is within 30 minutes of the end time.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-white font-semibold mb-1">
                          Event End Time
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {event && formatDate(event.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                      onClick={() => router.back()}
                    >
                      Go Back
                    </Button>
                    <Link href="/events" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25">
                        View Other Events
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Success/Error Message */}
                  {submitStatus.type && (
                    <Alert
                      variant={submitStatus.type === 'error' ? 'destructive' : 'default'}
                      className={`mb-6 ${
                        submitStatus.type === 'success'
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}
                    >
                      {submitStatus.type === 'success' && (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      <AlertDescription>{submitStatus.message}</AlertDescription>
                    </Alert>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white text-sm font-medium">
                          Full Name <span className="text-red-400">*</span>
                        </Label>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
                                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white text-sm font-medium">
                          Email Address <span className="text-red-400">*</span>
                        </Label>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="your.email@example.com"
                                  type="email"
                                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Phone Field */}
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white text-sm font-medium">
                          Phone Number <span className="text-red-400">*</span>
                        </Label>
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="+91 98765 43210"
                                  type="tel"
                                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* City & Profession - Two Columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-white text-sm font-medium">
                            City
                          </Label>
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Your city"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="profession" className="text-white text-sm font-medium">
                            Profession
                          </Label>
                          <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Your profession"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                          onClick={() => router.back()}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25"
                          disabled={submitting || availableSlots === 0}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Registering...
                            </>
                          ) : (
                            'Register Now'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>

                  {/* Help Text */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs text-slate-500 text-center">
                      By registering, you agree to receive communication about this
                      event. We'll send you event details and reminders closer to the
                      date.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
