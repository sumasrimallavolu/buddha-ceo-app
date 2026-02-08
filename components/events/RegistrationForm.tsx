'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  ArrowLeft,
} from 'lucide-react';

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
  timings: string;
  maxParticipants?: number;
  currentRegistrations: number;
  imageUrl?: string;
}

interface RegistrationFormProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationForm({
  event,
  open,
  onOpenChange,
}: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch(`/api/events/${event._id}/register`, {
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

      setSubmitStatus({
        type: 'success',
        message: `Successfully registered for ${event.title}! We'll send you more details shortly.`,
      });

      // Reset form
      form.reset();

      // Close dialog after 3 seconds
      setTimeout(() => {
        onOpenChange(false);
        setSubmitStatus({ type: null, message: '' });
      }, 3000);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const availableSlots = event.maxParticipants
    ? event.maxParticipants - event.currentRegistrations
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Register for Event
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
            {event.title}
          </DialogDescription>
        </DialogHeader>

        {/* Event Details */}
        <Card className="p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">Dates</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(event.startDate)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  to {formatDate(event.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">Timings</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{event.timings}</p>
              </div>
            </div>

            {availableSlots !== null && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <Users className="h-5 w-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">Availability</p>
                  <p className="text-sm">
                    {availableSlots > 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {availableSlots} slots remaining
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        Fully booked
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {event.currentRegistrations} / {event.maxParticipants} registered
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Success/Error Message */}
        {submitStatus.type && (
          <Alert
            variant={submitStatus.type === 'error' ? 'destructive' : 'default'}
            className={`${
              submitStatus.type === 'success'
                ? 'border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                : ''
            }`}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : null}
            <AlertDescription className="text-sm">
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Registration Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                      Full Name <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="border-gray-300 dark:border-gray-700"
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                      Email Address <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        type="email"
                        className="border-gray-300 dark:border-gray-700"
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                      Phone Number <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+91 98765 43210"
                        type="tel"
                        className="border-gray-300 dark:border-gray-700"
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
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your city"
                          className="border-gray-300 dark:border-gray-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                        Profession
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your profession"
                          className="border-gray-300 dark:border-gray-700"
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
            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting || availableSlots === 0}
              >
                {isSubmitting ? (
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
      </DialogContent>
    </Dialog>
  );
}
