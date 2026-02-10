'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, User, Mail, Phone, MapPin, Briefcase, Clock, GraduationCap } from 'lucide-react';
import { OtpInput } from '@/components/ui/OtpInput';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  profession: string;
  meditationExperience: string;
  teachingExperience: string;
  whyTeach: string;
  availability: string;
  age: string;
  education: string;
}

export function TeacherApplicationForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    profession: '',
    meditationExperience: '',
    teachingExperience: '',
    whyTeach: '',
    availability: '',
    age: '',
    education: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [otpError, setOtpError] = useState('');

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.profession.trim()) newErrors.profession = 'Profession is required';
    if (!formData.meditationExperience.trim() || formData.meditationExperience.length < 10) {
      newErrors.meditationExperience = 'Please describe your meditation experience (min 10 characters)';
    }
    if (!formData.whyTeach.trim() || formData.whyTeach.length < 20) {
      newErrors.whyTeach = 'Please tell us why you want to teach (min 20 characters)';
    }
    if (!formData.availability.trim()) newErrors.availability = 'Please describe your availability';
    if (!formData.age.trim()) newErrors.age = 'Age is required';
    else if (parseInt(formData.age) < 18) newErrors.age = 'Must be at least 18 years old';
    if (!formData.education.trim()) newErrors.education = 'Education is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setOtpError('');

    try {
      const response = await fetch('/api/teacher-application/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setOtpSent(true);
      setStep('otp');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setOtpError(error instanceof Error ? error.message : 'Failed to send verification code');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'details') {
      await handleSendOtp();
      return;
    }

    // Verify OTP
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter the 6-digit verification code');
      return;
    }

    setIsSubmitting(true);
    setOtpError('');

    try {
      const response = await fetch('/api/teacher-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          otpCode
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          country: 'India',
          profession: '',
          meditationExperience: '',
          teachingExperience: '',
          whyTeach: '',
          availability: '',
          age: '',
          education: ''
        });
        setOtpCode('');
        setStep('details');
        setOtpSent(false);
      } else {
        setOtpError('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setOtpError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
        <p className="text-slate-400">
          Thank you for your interest in teaching with us. We'll review your application and get back to you within 7 days.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border ${
                errors.firstName ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="John"
            />
          </div>
          {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
              errors.lastName ? 'border-red-500' : 'border-slate-700'
            } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border ${
                errors.email ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Phone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border ${
                errors.phone ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="+91 98765 43210"
            />
          </div>
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
            placeholder="Bangalore"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">State *</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
            placeholder="Karnataka"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Country *</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
            placeholder="India"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Age *
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
              errors.age ? 'border-red-500' : 'border-slate-700'
            } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
            placeholder="25"
          />
          {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Education *
          </label>
          <input
            type="text"
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
            placeholder="Bachelor's Degree"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Profession *
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
            placeholder="Software Engineer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Meditation Experience * (min 10 characters)
        </label>
        <textarea
          required
          rows={3}
          value={formData.meditationExperience}
          onChange={(e) => setFormData({ ...formData, meditationExperience: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
            errors.meditationExperience ? 'border-red-500' : 'border-slate-700'
          } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white`}
          placeholder="Describe your meditation practice, years of experience, techniques you're familiar with..."
        />
        {errors.meditationExperience && <p className="text-red-400 text-xs mt-1">{errors.meditationExperience}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Teaching Experience
        </label>
        <textarea
          rows={3}
          value={formData.teachingExperience}
          onChange={(e) => setFormData({ ...formData, teachingExperience: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white"
          placeholder="Any previous teaching experience? Share details..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Why do you want to teach with us? * (min 20 characters)
        </label>
        <textarea
          required
          rows={4}
          value={formData.whyTeach}
          onChange={(e) => setFormData({ ...formData, whyTeach: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
            errors.whyTeach ? 'border-red-500' : 'border-slate-700'
          } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white`}
          placeholder="Share your motivation for joining our teaching community..."
        />
        {errors.whyTeach && <p className="text-red-400 text-xs mt-1">{errors.whyTeach}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Availability *
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <textarea
            required
            rows={2}
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white"
            placeholder="Weekends, Evenings, etc."
          />
        </div>
      </div>

      {/* OTP Input - Only show after OTP is sent */}
      {step === 'otp' && (
        <div>
          <OtpInput
            email={formData.email}
            otpCode={otpCode}
            onOtpChange={setOtpCode}
            onResendOtp={handleResendOtp}
            error={otpError}
            resending={resending}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {step === 'otp' && (
          <motion.button
            type="button"
            onClick={() => {
              setStep('details');
              setOtpCode('');
              setOtpSent(false);
              setOtpError('');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </motion.button>
        )}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {step === 'otp' ? 'Verifying...' : 'Sending Code...'}
            </>
          ) : (
            <>
              <GraduationCap className="w-5 h-5" />
              {step === 'otp' ? 'Verify & Submit' : 'Send Verification Code'}
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
