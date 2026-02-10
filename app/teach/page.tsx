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
import { OtpInput } from '@/components/ui/OtpInput';
import { Loader2, CheckCircle2, GraduationCap, User, Mail, Phone, MapPin, Briefcase, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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

type TeacherEnrollmentFormValues = z.infer<typeof teacherEnrollmentSchema>;

export default function TeachPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resending, setResending] = useState(false);

  const form = useForm<TeacherEnrollmentFormValues>({
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

  const handleSendOtp = async () => {
    const data = form.getValues();
    
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/teacher-enrollment/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send verification code');
      }

      setOtpSent(true);
      setStep('otp');
      setSubmitStatus({
        type: 'success',
        message: 'Verification code sent to your email! Please check your inbox.',
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send verification code',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await handleSendOtp();
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: TeacherEnrollmentFormValues) => {
    if (step === 'details') {
      // First step: validate form and send OTP
      await handleSendOtp();
      return;
    }

    // Second step: verify OTP and submit enrollment
    if (!otpCode || otpCode.length !== 6) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter the 6-digit verification code',
      });
      return;
    }

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
          otpCode,
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

      form.reset();
      setOtpCode('');
      setStep('details');
      setOtpSent(false);
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
                Become a Meditation Teacher
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our mission to spread peace and wellness. Share the transformative power of meditation with communities worldwide.
              </p>
            </div>

            {/* Benefits Section */}
            <Card className="mb-8 bg-muted/30 border-border">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Why Become a Teacher?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md border border-border">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">Comprehensive Training</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive complete training in meditation techniques and teaching methodologies
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md border border-border">
                      <User className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">Global Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Join a worldwide network of meditation teachers and practitioners
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md border border-border">
                      <Briefcase className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">Transform Lives</h3>
                    <p className="text-sm text-muted-foreground">
                      Make a meaningful impact by helping others find peace and clarity
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Teacher Enrollment Application</CardTitle>
                <CardDescription>
                  Fill in your details to apply for our teacher training program
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitStatus.type && (
                  <Alert
                    variant={submitStatus.type === 'error' ? 'destructive' : 'default'}
                    className={`mb-6 ${submitStatus.type === 'success' ? 'border-secondary bg-secondary/10 text-secondary-foreground' : ''}`}
                  >
                    {submitStatus.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                    <AlertDescription>{submitStatus.message}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <User className="mr-2 h-5 w-5 text-primary" />
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
                          <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
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
                          <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
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
                          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
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
                          <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          {...form.register('age', { valueAsNumber: true })}
                          placeholder="25"
                          min="18"
                          max="100"
                        />
                        {form.formState.errors.age && (
                          <p className="text-sm text-destructive">{form.formState.errors.age.message}</p>
                        )}
                      </div>
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
                          <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          {...form.register('state')}
                          placeholder="Karnataka"
                        />
                        {form.formState.errors.state && (
                          <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          {...form.register('country')}
                          placeholder="India"
                        />
                        {form.formState.errors.country && (
                          <p className="text-sm text-destructive">{form.formState.errors.country.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profession" className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Current Profession *
                        </Label>
                        <Input
                          id="profession"
                          {...form.register('profession')}
                          placeholder="Software Engineer"
                        />
                        {form.formState.errors.profession && (
                          <p className="text-sm text-destructive">{form.formState.errors.profession.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="education">Education Qualification *</Label>
                      <Input
                        id="education"
                        {...form.register('education')}
                        placeholder="Bachelor's in Engineering"
                      />
                      {form.formState.errors.education && (
                        <p className="text-sm text-destructive">{form.formState.errors.education.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Experience Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                      Experience & Motivation
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="meditationExperience">
                        Describe your meditation experience * <span className="text-muted-foreground">(How long have you been practicing? What techniques have you learned?)</span>
                      </Label>
                      <Textarea
                        id="meditationExperience"
                        {...form.register('meditationExperience')}
                        placeholder="I have been practicing meditation for 3 years, specifically Anapanasati and mindfulness..."
                        rows={4}
                      />
                      {form.formState.errors.meditationExperience && (
                        <p className="text-sm text-destructive">{form.formState.errors.meditationExperience.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teachingExperience">
                        Teaching Experience (if any) <span className="text-muted-foreground">(Optional)</span>
                      </Label>
                      <Textarea
                        id="teachingExperience"
                        {...form.register('teachingExperience')}
                        placeholder="Have you taught meditation before? Describe your experience..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whyTeach">
                        Why do you want to become a meditation teacher? *
                      </Label>
                      <Textarea
                        id="whyTeach"
                        {...form.register('whyTeach')}
                        placeholder="I want to help others experience the peace and clarity I've found through meditation..."
                        rows={4}
                      />
                      {form.formState.errors.whyTeach && (
                        <p className="text-sm text-destructive">{form.formState.errors.whyTeach.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability" className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Availability for Training *
                      </Label>
                      <Textarea
                        id="availability"
                        {...form.register('availability')}
                        placeholder="I am available on weekends and weekday evenings. I can dedicate 10 hours per week..."
                        rows={3}
                      />
                      {form.formState.errors.availability && (
                        <p className="text-sm text-destructive">{form.formState.errors.availability.message}</p>
                      )}
                    </div>
                  </div>

                  {/* OTP Input - Only show after OTP is sent */}
                  {step === 'otp' && (
                    <div>
                      <OtpInput
                        email={form.getValues('email')}
                        otpCode={otpCode}
                        onOtpChange={setOtpCode}
                        onResendOtp={handleResendOtp}
                        error={submitStatus.type === 'error' && otpCode.length === 6 ? submitStatus.message : undefined}
                        resending={resending}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {step === 'otp' && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setStep('details');
                          setOtpCode('');
                          setOtpSent(false);
                          setSubmitStatus({ type: null, message: '' });
                        }}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {step === 'otp' ? 'Verifying...' : 'Sending Code...'}
                        </>
                      ) : (
                        step === 'otp' ? 'Verify & Submit' : 'Send Verification Code'
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this application, you agree to our review process. We will contact you within 5-7 business days.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Requirements Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-secondary/20 rounded-full p-1 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                    </div>
                    <span className="text-sm">Must be at least 18 years old</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary/20 rounded-full p-1 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                    </div>
                    <span className="text-sm">Minimum 6 months of regular meditation practice</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary/20 rounded-full p-1 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                    </div>
                    <span className="text-sm">Commitment to complete the teacher training program</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary/20 rounded-full p-1 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                    </div>
                    <span className="text-sm">Genuine interest in helping others through meditation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary/20 rounded-full p-1 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                    </div>
                    <span className="text-sm">Basic proficiency in English (for training materials)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
