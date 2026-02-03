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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, Calendar, Clock, Users } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Register for Event</DialogTitle>
          <DialogDescription className="text-base">
            {event.title}
          </DialogDescription>
        </DialogHeader>

        {/* Event Details */}
        <div className="bg-purple-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-purple-600" />
            <span className="font-medium">
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-purple-600" />
            <span>{event.timings}</span>
          </div>
          {availableSlots !== null && (
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4 text-purple-600" />
              <span>
                {availableSlots > 0 ? (
                  <span className="text-green-600 font-medium">
                    {availableSlots} slots available
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Event fully booked</span>
                )}
              </span>
            </div>
          )}
        </div>

        {submitStatus.type && (
          <Alert
            variant={submitStatus.type === 'error' ? 'destructive' : 'default'}
            className={submitStatus.type === 'success' ? 'border-green-500 text-green-700' : ''}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : null}
            <AlertDescription>{submitStatus.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Input placeholder="Your profession" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
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
