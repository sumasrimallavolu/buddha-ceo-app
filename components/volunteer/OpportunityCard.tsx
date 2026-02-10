'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { VolunteerOpportunity } from '@/types/volunteer';

interface OpportunityCardProps {
  opportunity: VolunteerOpportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  // Get color coding for type badge
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Remote':
        return 'bg-blue-500/20 text-blue-400';
      case 'On-site':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'Hybrid':
        return 'bg-violet-500/20 text-violet-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  // Truncate description to 2 lines
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  // Show max 3 skills, +X more if more
  const displaySkills = opportunity.requiredSkills.slice(0, 3);
  const remainingSkills = opportunity.requiredSkills.length - 3;

  return (
    <Link href={`/volunteer-opportunities/${opportunity._id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="group h-full bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 cursor-pointer"
      >
        {/* Type Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(opportunity.type)}`}>
            {opportunity.type}
          </span>
          {opportunity.status === 'closed' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
              Closed
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
          {opportunity.title}
        </h3>

        {/* Description (truncated to 2 lines) */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {truncateDescription(opportunity.description)}
        </p>

        {/* Details */}
        <div className="space-y-3 mb-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="truncate">{opportunity.location}</span>
          </div>

          {/* Time Commitment */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="truncate">{opportunity.timeCommitment}</span>
          </div>

          {/* Applications Count */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Users className="w-4 h-4 text-violet-400 flex-shrink-0" />
            <span>
              {opportunity.currentApplications} {opportunity.currentApplications === 1 ? 'application' : 'applications'}
            </span>
            {opportunity.maxVolunteers && (
              <span className="text-slate-500">
                / {opportunity.maxVolunteers} max
              </span>
            )}
          </div>
        </div>

        {/* Required Skills Tags */}
        {opportunity.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {displaySkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-xs border border-slate-600"
              >
                {skill}
              </span>
            ))}
            {remainingSkills > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-700/50 text-slate-400 text-xs border border-slate-600">
                +{remainingSkills} more
              </span>
            )}
          </div>
        )}

        {/* View Details Button */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
            View Details & Apply
          </span>
          <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </motion.div>
    </Link>
  );
}
