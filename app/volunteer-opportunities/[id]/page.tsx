'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Calendar, Users, Loader2 } from 'lucide-react';
import { VolunteerApplicationForm } from '@/components/volunteer/VolunteerApplicationForm';
import { VolunteerOpportunity } from '@/types/volunteer';

export default function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [opportunity, setOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOpportunity() {
      try {
        setLoading(true);
        const response = await fetch(`/api/volunteer-opportunities/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            router.push('/volunteer-opportunities');
            return;
          }
          throw new Error('Failed to fetch opportunity');
        }

        const data = await response.json();
        setOpportunity(data);
      } catch (error) {
        console.error('Error fetching opportunity:', error);
        setError('Failed to load opportunity details');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchOpportunity();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-6">
            <p className="text-4xl">⚠️</p>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Opportunity Not Found</h2>
          <p className="text-slate-400 mb-6">{error || 'This opportunity may have been removed.'}</p>
          <button
            onClick={() => router.push('/volunteer-opportunities')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300"
          >
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  const isOpen = opportunity.status === 'open';
  const vacanciesRemaining = opportunity.maxVolunteers - opportunity.currentApplications;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/volunteer-opportunities')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Opportunities</span>
          </motion.button>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 mb-8"
          >
            {/* Title and Badges */}
            <div className="flex flex-wrap items-start gap-3 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white flex-1">
                {opportunity.title}
              </h1>
              <div className="flex gap-2">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    opportunity.type === 'Remote'
                      ? 'bg-blue-500/20 text-blue-400'
                      : opportunity.type === 'On-site'
                      ? 'bg-violet-500/20 text-violet-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {opportunity.type}
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isOpen
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-300 leading-relaxed text-lg mb-8">
              {opportunity.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Location</p>
                  <p className="text-white font-medium">{opportunity.location}</p>
                </div>
              </div>

              {/* Time Commitment */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Time Commitment</p>
                  <p className="text-white font-medium">{opportunity.timeCommitment}</p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Duration</p>
                  <p className="text-white font-medium">
                    {new Date(opportunity.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    {' - '}
                    {new Date(opportunity.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Vacancies */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Vacancies</p>
                  <p className="text-white font-medium">
                    {isOpen ? `${vacanciesRemaining} remaining` : `${opportunity.currentApplications} applied`}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Max {opportunity.maxVolunteers} volunteers
                  </p>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            {opportunity.requiredSkills.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-slate-400 mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Custom Questions Preview */}
          {opportunity.customQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">Additional Questions</h3>
              <div className="space-y-4">
                {opportunity.customQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-start gap-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">
                        {question.title}
                        {question.required && <span className="text-red-400 ml-1">*</span>}
                      </p>
                      <p className="text-sm text-slate-500 capitalize">
                        {question.type}
                        {question.type === 'select' && question.options && (
                          <span className="ml-2">
                            (Options: {question.options.join(', ')})
                          </span>
                        )}
                        {question.type === 'checkbox' && question.options && (
                          <span className="ml-2">
                            (Select multiple: {question.options.join(', ')})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Application Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              {isOpen ? 'Apply for This Opportunity' : 'Applications Closed'}
            </h2>

            {isOpen ? (
              <>
                <p className="text-slate-400 mb-8">
                  Ready to make a difference? Fill out the form below to apply for this volunteer
                  opportunity. We'll review your application and get back to you soon.
                </p>
                <VolunteerApplicationForm
                  opportunityId={opportunity._id}
                  opportunityTitle={opportunity.title}
                  customQuestions={opportunity.customQuestions}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
                  <p className="text-4xl">🔒</p>
                </div>
                <p className="text-slate-400 mb-6">
                  This opportunity is no longer accepting applications. Check out other available
                  opportunities on the listings page.
                </p>
                <button
                  onClick={() => router.push('/volunteer-opportunities')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-300"
                >
                  View Other Opportunities
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
