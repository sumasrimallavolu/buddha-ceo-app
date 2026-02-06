'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, User, Mail, Phone, Heart, Lightbulb, Users, Clock } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  age: string;
  profession: string;
  interestArea: string;
  experience: string;
  availability: string;
  whyVolunteer: string;
  skills: string;
}

interface VolunteerApplicationFormProps {
  initialInterestArea?: string;
}

export function VolunteerApplicationForm({ initialInterestArea }: VolunteerApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    age: '',
    profession: '',
    interestArea: initialInterestArea || '',
    experience: '',
    availability: '',
    whyVolunteer: '',
    skills: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.interestArea) newErrors.interestArea = 'Please select an area of interest';
    if (!formData.experience.trim() || formData.experience.length < 10) {
      newErrors.experience = 'Please describe your experience (min 10 characters)';
    }
    if (!formData.whyVolunteer.trim() || formData.whyVolunteer.length < 20) {
      newErrors.whyVolunteer = 'Please tell us why you want to volunteer (min 20 characters)';
    }
    if (!formData.availability.trim()) newErrors.availability = 'Please describe your availability';
    if (!formData.skills.trim()) newErrors.skills = 'Please describe your skills';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/volunteer-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age)
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          country: 'India',
          age: '',
          profession: '',
          interestArea: '',
          experience: '',
          availability: '',
          whyVolunteer: '',
          skills: ''
        });
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
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
          Thank you for your interest in volunteering with us. We'll review your application and get back to you within 5 days.
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
          <label className="block text-sm font-semibold text-slate-300 mb-2">Age *</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
            placeholder="25"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Profession *
          </label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
            placeholder="Software Engineer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Area of Interest *
        </label>
        <select
          value={formData.interestArea}
          onChange={(e) => setFormData({ ...formData, interestArea: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
            errors.interestArea ? 'border-red-500' : 'border-slate-700'
          } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
        >
          <option value="">Select an area</option>
          <option value="Community Support">Community Support</option>
          <option value="Content Creation">Content Creation</option>
          <option value="Event Coordination">Event Coordination</option>
          <option value="Outreach & Partnerships">Outreach & Partnerships</option>
          <option value="Other">Other</option>
        </select>
        {errors.interestArea && <p className="text-red-400 text-xs mt-1">{errors.interestArea}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Relevant Experience * (min 10 characters)
        </label>
        <textarea
          rows={3}
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
            errors.experience ? 'border-red-500' : 'border-slate-700'
          } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white`}
          placeholder="Describe any relevant experience, skills, or background..."
        />
        {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Why do you want to volunteer? * (min 20 characters)
        </label>
        <textarea
          rows={4}
          value={formData.whyVolunteer}
          onChange={(e) => setFormData({ ...formData, whyVolunteer: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
            errors.whyVolunteer ? 'border-red-500' : 'border-slate-700'
          } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white`}
          placeholder="Share your motivation for volunteering..."
        />
        {errors.whyVolunteer && <p className="text-red-400 text-xs mt-1">{errors.whyVolunteer}</p>}
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
            placeholder="Weekends, 5-10 hours/week, etc."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">
          Skills & Talents *
        </label>
        <textarea
          rows={3}
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
            errors.skills ? 'border-red-500' : 'border-slate-700'
          } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white`}
          placeholder="Design, Writing, Event Management, Social Media, etc."
        />
        {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills}</p>}
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            Submit Application
          </>
        )}
      </motion.button>
    </form>
  );
}
