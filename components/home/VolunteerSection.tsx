'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, Users, CheckCircle, ArrowRight, Heart, Clock } from 'lucide-react';

export function VolunteerSection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-sm font-semibold mb-6">
              🤝 Join Our Community
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Make a Difference Through Service
            </h2>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Join our global community of volunteers dedicated to spreading peace and transformation.
              Your time and skills can impact thousands of lives through meaningful service.
            </p>
          </motion.div>

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl"
            >
              <Users className="w-10 h-10 mx-auto mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-sm opacity-90">Volunteers Worldwide</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-8 rounded-2xl bg-slate-800 text-white shadow-lg border border-slate-700"
            >
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-2">5K+</div>
              <div className="text-sm text-slate-400">Hours Given</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-8 rounded-2xl bg-slate-800 text-white shadow-lg border border-slate-700"
            >
              <Award className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-sm text-slate-400">Lives Impacted</div>
            </motion.div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-900/50 rounded-3xl p-8 md:p-12 border border-slate-800 mb-12"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Why Volunteer With Us?</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                'Be part of a global movement for peace and inner transformation',
                'Develop new skills and gain valuable experience',
                'Connect with like-minded individuals from around the world',
                'Flexible commitment options that fit your schedule'
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="leading-relaxed">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/volunteer-opportunities">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 inline-flex items-center gap-3 text-lg shadow-lg hover:shadow-xl"
              >
                <Heart className="w-6 h-6" />
                View Opportunities
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
            <p className="text-slate-500 text-sm mt-4">
              Explore all available volunteer positions and find your perfect role
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
