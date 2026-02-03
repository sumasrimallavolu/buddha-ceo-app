'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, Calendar, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  city: z.string().min(2, 'City is required'),
  profession: z.string().optional(),
  eventId: z.string().optional(),
  eventType: z.enum(['event', 'conference']),
  experience: z.string().optional(),
  expectations: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      profession: '',
      eventType: 'event',
      experience: '',
      expectations: '',
    },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          name: `${data.firstName} ${data.lastName}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setSubmitStatus({
        type: 'success',
        message: `Thank you ${data.firstName}! Your ${data.eventType} registration has been submitted successfully. We'll send you more details shortly.`,
      });

      form.reset();
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Event Registration
              </h1>
              <p className="text-lg text-muted-foreground">
                Register for our upcoming events, conferences, and programs
              </p>
            </div>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Registration Form</CardTitle>
                <CardDescription>
                  Fill in your details to complete your registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitStatus.type && (
                  <Alert
                    variant={submitStatus.type === 'error' ? 'destructive' : 'default'}
                    className={`mb-6 ${submitStatus.type === 'success' ? 'border-green-500 bg-green-50 text-green-700' : ''}`}
                  >
                    {submitStatus.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                    <AlertDescription>{submitStatus.message}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Registration Type */}
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Registration Type *</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => form.setValue('eventType', 'event')}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          form.watch('eventType') === 'event'
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-semibold">Event</div>
                        <div className="text-sm text-muted-foreground">Regular events & programs</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue('eventType', 'conference')}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          form.watch('eventType') === 'conference'
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="font-semibold">Conference</div>
                        <div className="text-sm text-muted-foreground">Global conferences</div>
                      </button>
                    </div>
                    {form.formState.errors.eventType && (
                      <p className="text-sm text-red-600">{form.formState.errors.eventType.message}</p>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <User className="mr-2 h-5 w-5 text-purple-600" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          {...form.register('firstName')}
                          placeholder="John"
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          {...form.register('lastName')}
                          placeholder="Doe"
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register('email')}
                          placeholder="john.doe@example.com"
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...form.register('phone')}
                          placeholder="+91 98765 43210"
                        />
                        {form.formState.errors.phone && (
                          <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          City *
                        </Label>
                        <Input
                          id="city"
                          {...form.register('city')}
                          placeholder="Bangalore"
                        />
                        {form.formState.errors.city && (
                          <p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profession" className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Profession
                        </Label>
                        <Input
                          id="profession"
                          {...form.register('profession')}
                          placeholder="Software Engineer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Additional Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Meditation Experience (Optional)</Label>
                      <Textarea
                        id="experience"
                        {...form.register('experience')}
                        placeholder="Tell us about your prior meditation experience..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectations">What do you hope to gain? (Optional)</Label>
                      <Textarea
                        id="expectations"
                        {...form.register('expectations')}
                        placeholder="Share your expectations from this program..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting Registration...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Upcoming Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Check our events page for the latest programs and schedules
                  </p>
                  <a href="/events" className="text-purple-600 text-sm font-medium hover:underline mt-2 inline-block">
                    View Events →
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Become a Teacher</h3>
                  <p className="text-sm text-muted-foreground">
                    Join our teacher training program and share meditation with others
                  </p>
                  <a href="/teach" className="text-purple-600 text-sm font-medium hover:underline mt-2 inline-block">
                    Learn More →
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact us if you have any questions about registration
                  </p>
                  <a href="/contact" className="text-purple-600 text-sm font-medium hover:underline mt-2 inline-block">
                    Contact Us →
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
