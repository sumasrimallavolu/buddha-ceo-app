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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle2, Calendar, User, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
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

const teacherEnrollmentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  profession: z.string().min(2, 'Profession is required'),
  meditationExperience: z.string().min(10, 'Please describe your meditation experience (min 10 characters)'),
  teachingExperience: z.string().optional(),
  whyTeach: z.string().min(20, 'Please tell us why you want to become a teacher (min 20 characters)'),
  availability: z.string().min(5, 'Please describe your availability'),
  age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Invalid age'),
  education: z.string().min(2, 'Education is required'),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;
type TeacherEnrollmentFormValues = z.infer<typeof teacherEnrollmentSchema>;

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState('participant');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const participantForm = useForm<RegistrationFormValues>({
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

  const teacherForm = useForm<TeacherEnrollmentFormValues>({
    resolver: zodResolver(teacherEnrollmentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      country: '',
      profession: '',
      meditationExperience: '',
      teachingExperience: '',
      whyTeach: '',
      availability: '',
      age: 0,
      education: '',
    },
  });

  const onParticipantSubmit = async (data: RegistrationFormValues) => {
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
        message: `Thank you ${data.firstName}! Your registration has been submitted successfully. We'll send you more details shortly.`,
      });

      participantForm.reset();
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTeacherSubmit = async (data: TeacherEnrollmentFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/teacher-enrollment', {
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
        throw new Error(result.error || 'Enrollment failed');
      }

      setSubmitStatus({
        type: 'success',
        message: `Thank you ${data.firstName}! Your teacher enrollment application has been submitted successfully. Our team will review your application and contact you within 5-7 business days.`,
      });

      teacherForm.reset();
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Enrollment failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md text-blue-400 text-sm font-medium border border-white/10 mb-6">
              <User className="w-4 h-4 text-amber-300" />
              <span>Join Us</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Register &{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Get Involved
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto border-l-4 border-blue-500/40 pl-6">
              Register for our programs or become a certified meditation teacher
            </p>
          </div>
        </section>

        {/* Registration Forms Section */}
        <section className="py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Status Alert */}
              {submitStatus.type && (
                <Alert
                  className={`mb-6 backdrop-blur-sm ${
                    submitStatus.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <CheckCircle2 className={`h-4 w-4 ${submitStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`} />
                  <AlertDescription
                    className={submitStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}
                  >
                    {submitStatus.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Tabs Card */}
              <Card className="border border-white/10 shadow-xl bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-white/5 text-center">
                  <CardTitle className="text-3xl text-white">Choose Your Path</CardTitle>
                  <CardDescription className="text-base text-slate-400">
                    Select an option below to begin your journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm p-2 rounded-xl border border-white/10 shadow-lg">
                      <TabsTrigger
                        value="participant"
                        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white hover:bg-white/10 text-slate-400 transition-all"
                      >
                        <User className="h-4 w-4" />
                        Participant Registration
                      </TabsTrigger>
                      <TabsTrigger
                        value="teacher"
                        className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-violet-500 data-[state=active]:text-white hover:bg-white/10 text-slate-400 transition-all"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Teacher Enrollment
                      </TabsTrigger>
                    </TabsList>

                    {/* Participant Registration Form */}
                    <TabsContent value="participant" className="mt-6">
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                            Register for Programs
                          </h3>
                          <p className="text-slate-400">
                            Join our transformative meditation programs
                          </p>
                        </div>

                        <form onSubmit={participantForm.handleSubmit(onParticipantSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="p-firstName">First Name *</Label>
                              <Input
                                id="p-firstName"
                                {...participantForm.register('firstName')}
                                placeholder="John"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {participantForm.formState.errors.firstName && (
                                <p className="text-sm text-destructive">{participantForm.formState.errors.firstName.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="p-lastName">Last Name *</Label>
                              <Input
                                id="p-lastName"
                                {...participantForm.register('lastName')}
                                placeholder="Doe"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {participantForm.formState.errors.lastName && (
                                <p className="text-sm text-destructive">{participantForm.formState.errors.lastName.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="p-email">Email *</Label>
                              <Input
                                id="p-email"
                                type="email"
                                {...participantForm.register('email')}
                                placeholder="john.doe@example.com"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {participantForm.formState.errors.email && (
                                <p className="text-sm text-destructive">{participantForm.formState.errors.email.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="p-phone">Phone *</Label>
                              <Input
                                id="p-phone"
                                {...participantForm.register('phone')}
                                placeholder="+91 98765 43210"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {participantForm.formState.errors.phone && (
                                <p className="text-sm text-destructive">{participantForm.formState.errors.phone.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="p-city">City *</Label>
                              <Input
                                id="p-city"
                                {...participantForm.register('city')}
                                placeholder="Bangalore"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {participantForm.formState.errors.city && (
                                <p className="text-sm text-destructive">{participantForm.formState.errors.city.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="p-profession">Profession</Label>
                              <Input
                                id="p-profession"
                                {...participantForm.register('profession')}
                                placeholder="Software Engineer"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="p-eventType">Registration Type *</Label>
                            <Select
                              value={participantForm.watch('eventType')}
                              onValueChange={(value) => participantForm.setValue('eventType', value as 'event' | 'conference')}
                            >
                              <SelectTrigger className="border border-primary/30 focus:border-primary">
                                <SelectValue placeholder="Select registration type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="event">Event Program</SelectItem>
                                <SelectItem value="conference">Conference</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="p-experience">Meditation Experience (Optional)</Label>
                            <Textarea
                              id="p-experience"
                              {...participantForm.register('experience')}
                              placeholder="Tell us about your meditation background..."
                              rows={3}
                              disabled={isSubmitting}
                              className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="p-expectations">Expectations (Optional)</Label>
                            <Textarea
                              id="p-expectations"
                              {...participantForm.register('expectations')}
                              placeholder="What do you hope to gain from this program?"
                              rows={3}
                              disabled={isSubmitting}
                              className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                Submit Registration
                              </>
                            )}
                          </Button>
                        </form>
                      </div>
                    </TabsContent>

                    {/* Teacher Enrollment Form */}
                    <TabsContent value="teacher" className="mt-6">
                      <div className="space-y-6">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                            Become a Certified Teacher
                          </h3>
                          <p className="text-slate-400">
                            Join our teacher training program and spread meditation wisdom
                          </p>
                        </div>

                        <form onSubmit={teacherForm.handleSubmit(onTeacherSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="t-firstName">First Name *</Label>
                              <Input
                                id="t-firstName"
                                {...teacherForm.register('firstName')}
                                placeholder="John"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {teacherForm.formState.errors.firstName && (
                                <p className="text-sm text-destructive">{teacherForm.formState.errors.firstName.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="t-lastName">Last Name *</Label>
                              <Input
                                id="t-lastName"
                                {...teacherForm.register('lastName')}
                                placeholder="Doe"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {teacherForm.formState.errors.lastName && (
                                <p className="text-sm text-destructive">{teacherForm.formState.errors.lastName.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="t-email">Email *</Label>
                              <Input
                                id="t-email"
                                type="email"
                                {...teacherForm.register('email')}
                                placeholder="john.doe@example.com"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {teacherForm.formState.errors.email && (
                                <p className="text-sm text-destructive">{teacherForm.formState.errors.email.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="t-phone">Phone *</Label>
                              <Input
                                id="t-phone"
                                {...teacherForm.register('phone')}
                                placeholder="+91 98765 43210"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {teacherForm.formState.errors.phone && (
                                <p className="text-sm text-destructive">{teacherForm.formState.errors.phone.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="t-city">City *</Label>
                              <Input
                                id="t-city"
                                {...teacherForm.register('city')}
                                placeholder="Bangalore"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {teacherForm.formState.errors.city && (
                                <p className="text-sm text-destructive">{teacherForm.formState.errors.city.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="t-state">State *</Label>
                              <Input
                                id="t-state"
                                {...teacherForm.register('state')}
                                placeholder="Karnataka"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {teacherForm.formState.errors.state && (
                                <p className="text-sm text-destructive">{teacherForm.formState.errors.state.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="t-country">Country *</Label>
                              <Input
                                id="t-country"
                                {...teacherForm.register('country')}
                                placeholder="India"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {teacherForm.formState.errors.country && (
                                <p className="text-sm text-destructive">{teacherForm.formState.errors.country.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="t-profession">Profession *</Label>
                              <Input
                                id="t-profession"
                                {...teacherForm.register('profession')}
                                placeholder="Software Engineer"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {teacherForm.formState.errors.profession && (
                                <p className="text-sm text-destructive">{teacherForm.formState.errors.profession.message}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="t-age">Age *</Label>
                              <Input
                                id="t-age"
                                type="number"
                                {...teacherForm.register('age', { valueAsNumber: true })}
                                placeholder="25"
                                disabled={isSubmitting}
                                className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                              />
                              {teacherForm.formState.errors.age && (
                                <p className="text-sm text-destructive">{teacherForm.formState.errors.age.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="t-education">Education *</Label>
                            <Input
                              id="t-education"
                              {...teacherForm.register('education')}
                              placeholder="Bachelor's Degree"
                              disabled={isSubmitting}
                              className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                            />
                            {teacherForm.formState.errors.education && (
                              <p className="text-sm text-destructive">{teacherForm.formState.errors.education.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="t-meditationExperience">Meditation Experience *</Label>
                            <Textarea
                              id="t-meditationExperience"
                              {...teacherForm.register('meditationExperience')}
                              placeholder="Describe your meditation journey and practice..."
                              rows={4}
                              disabled={isSubmitting}
                              className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                            />
                            {teacherForm.formState.errors.meditationExperience && (
                              <p className="text-sm text-destructive">{teacherForm.formState.errors.meditationExperience.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="t-teachingExperience">Teaching Experience (Optional)</Label>
                            <Textarea
                              id="t-teachingExperience"
                              {...teacherForm.register('teachingExperience')}
                              placeholder="Any prior teaching experience..."
                              rows={3}
                              disabled={isSubmitting}
                              className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="t-whyTeach">Why do you want to become a teacher? *</Label>
                            <Textarea
                              id="t-whyTeach"
                              {...teacherForm.register('whyTeach')}
                              placeholder="Share your motivation for teaching meditation..."
                              rows={4}
                              disabled={isSubmitting}
                              className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                            />
                            {teacherForm.formState.errors.whyTeach && (
                              <p className="text-sm text-destructive">{teacherForm.formState.errors.whyTeach.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="t-availability">Availability *</Label>
                            <Textarea
                              id="t-availability"
                              {...teacherForm.register('availability')}
                              placeholder="Weekends, Evenings, etc..."
                              rows={2}
                              disabled={isSubmitting}
                              className="border-white/10 focus:border-blue-400 bg-white/5 text-white placeholder:text-slate-500"
                            />
                            {teacherForm.formState.errors.availability && (
                              <p className="text-sm text-destructive">{teacherForm.formState.errors.availability.message}</p>
                            )}
                          </div>

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-violet-500 hover:bg-violet-600 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <GraduationCap className="mr-2 h-5 w-5" />
                                Submit Enrollment Application
                              </>
                            )}
                          </Button>
                        </form>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-28 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="group hover:shadow-xl transition-all duration-300 border border-white/10 hover:border-blue-500/50 bg-white/5 backdrop-blur-md hover:scale-105">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-xl text-white">Participant Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Scientifically designed meditation programs',
                      'Expert guidance from experienced teachers',
                      'Certificate upon completion',
                      'Lifetime access to community resources',
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border border-white/10 hover:border-violet-500/50 bg-white/5 backdrop-blur-md hover:scale-105">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-xl text-white">Teacher Training</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Comprehensive meditation teacher certification',
                      'Teach globally recognized techniques',
                      'Ongoing support and mentorship',
                      'Join a network of 500+ certified teachers',
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
