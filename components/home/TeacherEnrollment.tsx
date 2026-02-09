'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { TeacherApplicationForm } from '@/components/forms/TeacherApplicationForm';

export function TeacherEnrollment() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return (
      <section className="py-16 bg-slate-900 relative overflow-hidden">
        {/* Back Button */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button
            onClick={() => setShowForm(false)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back
          </button>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-emerald-600 flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Teacher Application
              </h2>
              <p className="text-slate-400 text-sm">
                Certified meditation teachers: Share your wisdom
              </p>
            </div>

            <TeacherApplicationForm />
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-slate-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/20 text-violet-400 text-xs font-semibold mb-3">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>For Certified Teachers</span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Already a Meditation Teacher?
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Join our community of experienced teachers. Lead sessions, mentor students,
                  and create impact globally.
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    <span>100+ Active Teachers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>15+ Countries</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Flexible Hours</span>
                  </div>
                </div>
              </div>

              <motion.div className="flex-shrink-0">
                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-900 text-white font-semibold shadow-lg hover:shadow-violet-500/25 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Apply to Teach
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
