'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react';

function ContactSectionContent() {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') || 'general';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: subject,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (subject) {
      setFormData(prev => ({ ...prev, inquiryType: subject }));
    }
  }, [subject]);

  const inquiryTypes = {
    general: 'General Inquiry',
    program: 'Program Information',
    volunteer: 'Volunteer Opportunity',
    teacher: 'Teach With Us',
    partnership: 'Partnership Inquiry',
    feedback: 'Feedback',
    other: 'Other'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Here you would make an actual API call to save the contact message
    // For example:
    // await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', inquiryType: subject, message: '' });
    }, 3000);
  };

  const getSubjectInfo = () => {
    switch (subject) {
      case 'volunteer':
        return {
          title: 'Join as a Volunteer',
          description: 'We\'d love to have you join our community of volunteers!'
        };
      case 'teacher':
        return {
          title: 'Share Your Wisdom',
          description: 'Contribute as a meditation teacher and transform lives'
        };
      case 'corporate-volunteer':
        return {
          title: 'Corporate Volunteering',
          description: 'Partner with us for employee engagement programs'
        };
      default:
        return {
          title: 'Get in Touch',
          description: 'Have questions? We\'d love to hear from you'
        };
    }
  };

  const subjectInfo = getSubjectInfo();

  return (
    <section className="py-16 bg-slate-900 relative overflow-hidden" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {subjectInfo.title}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {subjectInfo.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Contact Methods */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Reach Out Anytime</h3>

            <motion.a
              href="mailto:info@meditation.org"
              whileHover={{ scale: 1.02, x: 5 }}
              className="block bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-blue-600 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold mb-1">Email Us</h4>
                  <p className="text-slate-400 text-sm font-medium mb-0.5">info@meditation.org</p>
                  <p className="text-slate-500 text-xs">We reply within 24 hours</p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href="tel:+919876543210"
              whileHover={{ scale: 1.02, x: 5 }}
              className="block bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-blue-600 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold mb-1">Call Us</h4>
                  <p className="text-slate-400 text-sm font-medium mb-0.5">+91 98765 43210</p>
                  <p className="text-slate-500 text-xs">Mon-Sat, 9AM-6PM IST</p>
                </div>
              </div>
            </motion.a>

            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              className="block bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-blue-600 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold mb-1">Visit Us</h4>
                  <p className="text-slate-400 text-sm font-medium mb-0.5">Meditation Center, Bangalore</p>
                  <p className="text-slate-500 text-xs">By appointment only</p>
                </div>
              </div>
            </motion.div>

            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800 rounded-2xl p-6 border border-slate-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold text-white">Office Hours</h4>
              </div>
              <p className="text-slate-400 text-sm mb-2">Monday - Saturday</p>
              <p className="text-white text-lg font-semibold">9:00 AM - 6:00 PM IST</p>
              <p className="text-slate-500 text-xs mt-3">Closed on Sundays and public holidays</p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="bg-slate-800 rounded-3xl p-8 md:p-10 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-6">Send us a Message</h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                  <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        required
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 text-white"
                      >
                        {Object.entries(inquiryTypes).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all duration-300 resize-none text-white"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-slate-500 text-center">
                    By submitting, you agree to our{' '}
                    <a href="#" className="text-blue-400 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <Suspense fallback={
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-slate-400">Loading...</div>
          </div>
        </div>
      </section>
    }>
      <ContactSectionContent />
    </Suspense>
  );
}
