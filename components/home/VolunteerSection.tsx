'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, Award, Users, Globe, CheckCircle, ArrowRight, Sparkles, Heart, Lightbulb, Handshake, Clock } from 'lucide-react';
import { useState } from 'react';
import { VolunteerApplicationForm } from '@/components/forms/VolunteerApplicationForm';

const benefits = [
  {
    icon: GraduationCap,
    title: 'Certified Training',
    description: 'Internationally recognized meditation teacher certification'
  },
  {
    icon: Users,
    title: 'Global Community',
    description: 'Join 500+ certified teachers across 20+ countries'
  },
  {
    icon: Award,
    title: 'Ongoing Support',
    description: 'Continuous learning opportunities and mentorship'
  },
  {
    icon: Globe,
    title: 'Teach Worldwide',
    description: 'Conduct sessions online or in-person globally'
  }
];

const opportunities = [
  {
    icon: Heart,
    title: 'Community Support',
    description: 'Help create welcoming spaces for meditation practitioners',
    time: 'Flexible hours',
    type: 'Remote & On-site'
  },
  {
    icon: Lightbulb,
    title: 'Content Creation',
    description: 'Share transformative stories and create inspiring content',
    time: '5-10 hours/week',
    type: 'Remote'
  },
  {
    icon: Users,
    title: 'Event Coordination',
    description: 'Organize retreats, workshops, and community events',
    time: 'Weekend commitment',
    type: 'On-site'
  },
  {
    icon: Handshake,
    title: 'Outreach & Partnerships',
    description: 'Connect with organizations and expand our impact',
    time: '8-12 hours/week',
    type: 'Hybrid'
  }
];

export function VolunteerSection() {
  const [showForm, setShowForm] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  if (showForm) {
    return (
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Back Button */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <button
            onClick={() => {
              setShowForm(false);
              setSelectedArea(null);
            }}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Overview
          </button>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Volunteer Application
              </h2>
              <p className="text-slate-400">
                Join our community of volunteers and make a difference!
              </p>
            </div>

            <VolunteerApplicationForm initialInterestArea={selectedArea || undefined} />
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-sm font-semibold">
              🤝 Join Our Community
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Make a Difference Through Service
            </h2>

            <p className="text-lg text-slate-400 leading-relaxed">
              Join our global community of volunteers dedicated to spreading peace and transformation.
              Your time and skills can impact thousands of lives.
            </p>

            {/* Impact Stats */}
            <div className="grid grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-blue-600 text-white shadow-lg"
              >
                <Users className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">200+</div>
                <div className="text-sm opacity-80">Volunteers</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-slate-800 text-white shadow-lg border border-slate-700"
              >
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">5K+</div>
                <div className="text-sm opacity-80">Hours Given</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-slate-800 text-white shadow-lg border border-slate-700"
              >
                <Award className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">50K+</div>
                <div className="text-sm opacity-80">Lives Impacted</div>
              </motion.div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Why Volunteer With Us?</h3>
              {[
                'Be part of a global movement for peace',
                'Develop new skills and gain experience',
                'Connect with like-minded individuals',
                'Flexible commitment options'
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Join as Volunteer
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Right Content - Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Volunteer Opportunities</h3>

            {opportunities.map((opportunity, index) => {
              const Icon = opportunity.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => {
                    setSelectedArea(opportunity.title);
                    setShowForm(true);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-blue-600 transition-all duration-300 w-full text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2">{opportunity.title}</h4>
                      <p className="text-slate-400 text-sm mb-3">{opportunity.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{opportunity.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>{opportunity.type}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 self-center" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
