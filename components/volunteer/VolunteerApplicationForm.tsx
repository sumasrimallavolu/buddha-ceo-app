'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, User, Mail, Phone, Heart } from 'lucide-react';
import { CustomQuestion } from '@/types/volunteer';

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
  experience: string;
  availability: string;
  whyVolunteer: string;
  skills: string;
  customAnswers: Record<string, string>;
}

interface VolunteerApplicationFormProps {
  opportunityId: string;
  opportunityTitle: string;
  customQuestions: CustomQuestion[];
}

export function VolunteerApplicationForm({
  opportunityId,
  opportunityTitle,
  customQuestions
}: VolunteerApplicationFormProps) {
  const router = useRouter();
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
    experience: '',
    availability: '',
    whyVolunteer: '',
    skills: '',
    customAnswers: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | string, string>>>({});

  // Initialize custom answers when questions change
  useEffect(() => {
    const initialCustomAnswers: Record<string, string> = {};
    customQuestions.forEach(q => {
      if (q.type === 'checkbox') {
        initialCustomAnswers[q.id] = '[]'; // Initialize as empty JSON array
      } else {
        initialCustomAnswers[q.id] = '';
      }
    });
    setFormData(prev => ({
      ...prev,
      customAnswers: initialCustomAnswers
    }));
  }, [customQuestions]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData | string, string>> = {};

    // Validate base fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(parseInt(formData.age)) || parseInt(formData.age) < 18) {
      newErrors.age = 'You must be at least 18 years old';
    }
    if (!formData.profession.trim()) newErrors.profession = 'Profession is required';
    if (!formData.experience.trim() || formData.experience.length < 10) {
      newErrors.experience = 'Please describe your experience (min 10 characters)';
    }
    if (!formData.whyVolunteer.trim() || formData.whyVolunteer.length < 20) {
      newErrors.whyVolunteer = 'Please tell us why you want to volunteer (min 20 characters)';
    }
    if (!formData.availability.trim()) newErrors.availability = 'Please describe your availability';
    if (!formData.skills.trim()) newErrors.skills = 'Please describe your skills';

    // Validate custom questions
    customQuestions.forEach(question => {
      const answer = formData.customAnswers[question.id];
      if (question.required) {
        if (question.type === 'checkbox') {
          const selectedOptions = answer ? JSON.parse(answer) : [];
          if (selectedOptions.length === 0) {
            newErrors[`custom_${question.id}`] = 'Please select at least one option';
          }
        } else {
          if (!answer || !answer.trim()) {
            newErrors[`custom_${question.id}`] = `${question.title} is required`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomAnswerChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customAnswers: {
        ...prev.customAnswers,
        [questionId]: value
      }
    }));
    // Clear error when user starts typing
    if (errors[`custom_${questionId}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`custom_${questionId}`];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (questionId: string, option: string) => {
    const currentAnswer = formData.customAnswers[questionId] || '[]';
    const selectedOptions: string[] = JSON.parse(currentAnswer);

    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(o => o !== option)
      : [...selectedOptions, option];

    handleCustomAnswerChange(questionId, JSON.stringify(newOptions));
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
          opportunityId,
          opportunityTitle,
          ...formData,
          age: parseInt(formData.age)
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        alert(data.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof Omit<FormData, 'customAnswers'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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
        <p className="text-slate-400 mb-4">
          Thank you for your interest in volunteering with us. We'll review your application and get back to you soon.
        </p>
        <p className="text-sm text-slate-500">Redirecting to home page...</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Personal Information Section */}
      <div className="border-b border-slate-700 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
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
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
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
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.lastName ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
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
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border ${
                  errors.phone ? 'border-red-500' : 'border-slate-700'
                } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
                placeholder="+91 98765 43210"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.city ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="Bangalore"
            />
            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">State *</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleFieldChange('state', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.state ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="Karnataka"
            />
            {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Country *</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleFieldChange('country', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.country ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="India"
            />
            {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Age *</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleFieldChange('age', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.age ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="25"
              min="18"
            />
            {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Profession *
            </label>
            <input
              type="text"
              value={formData.profession}
              onChange={(e) => handleFieldChange('profession', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.profession ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="Software Engineer"
            />
            {errors.profession && <p className="text-red-400 text-xs mt-1">{errors.profession}</p>}
          </div>
        </div>
      </div>

      {/* Background Information Section */}
      <div className="border-b border-slate-700 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Background Information</h3>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Relevant Experience * (min 10 characters)
          </label>
          <textarea
            rows={3}
            value={formData.experience}
            onChange={(e) => handleFieldChange('experience', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
              errors.experience ? 'border-red-500' : 'border-slate-700'
            } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white`}
            placeholder="Describe any relevant experience, skills, or background..."
          />
          {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience}</p>}
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Why do you want to volunteer? * (min 20 characters)
          </label>
          <textarea
            rows={4}
            value={formData.whyVolunteer}
            onChange={(e) => handleFieldChange('whyVolunteer', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
              errors.whyVolunteer ? 'border-red-500' : 'border-slate-700'
            } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white`}
            placeholder="Share your motivation for volunteering..."
          />
          {errors.whyVolunteer && <p className="text-red-400 text-xs mt-1">{errors.whyVolunteer}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Availability *
            </label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => handleFieldChange('availability', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.availability ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="Weekends, 5-10 hours/week, etc."
            />
            {errors.availability && <p className="text-red-400 text-xs mt-1">{errors.availability}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Skills & Talents *
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => handleFieldChange('skills', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                errors.skills ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
              placeholder="Design, Writing, Event Management, Social Media, etc."
            />
            {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills}</p>}
          </div>
        </div>
      </div>

      {/* Custom Questions Section */}
      {customQuestions.length > 0 && (
        <div className="pb-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Additional Questions</h3>
          <div className="space-y-5">
            {customQuestions.map((question) => (
              <div key={question.id}>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  {question.title}
                  {question.required && ' *'}
                </label>

                {question.type === 'text' && (
                  <input
                    type="text"
                    value={formData.customAnswers[question.id] || ''}
                    onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                      errors[`custom_${question.id}`] ? 'border-red-500' : 'border-slate-700'
                    } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
                    placeholder="Your answer..."
                  />
                )}

                {question.type === 'textarea' && (
                  <textarea
                    rows={3}
                    value={formData.customAnswers[question.id] || ''}
                    onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                      errors[`custom_${question.id}`] ? 'border-red-500' : 'border-slate-700'
                    } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white`}
                    placeholder="Your answer..."
                  />
                )}

                {question.type === 'select' && question.options && (
                  <select
                    value={formData.customAnswers[question.id] || ''}
                    onChange={(e) => handleCustomAnswerChange(question.id, e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                      errors[`custom_${question.id}`] ? 'border-red-500' : 'border-slate-700'
                    } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white`}
                  >
                    <option value="">Select an option</option>
                    {question.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {question.type === 'checkbox' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, index) => {
                      const selectedOptions = formData.customAnswers[question.id]
                        ? JSON.parse(formData.customAnswers[question.id])
                        : [];
                      const isChecked = selectedOptions.includes(option);

                      return (
                        <label
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            isChecked
                              ? 'border-blue-600 bg-blue-600/10'
                              : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(question.id, option)}
                            className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 bg-slate-800"
                          />
                          <span className="text-slate-300">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {errors[`custom_${question.id}`] && (
                  <p className="text-red-400 text-xs mt-1">{errors[`custom_${question.id}`]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
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
