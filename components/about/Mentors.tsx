'use client';

import Image from 'next/image';
import { Award } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  title: string;
  role: 'founder' | 'co_founder' | 'trustee' | 'mentor' | 'steering_committee';
  description?: string;
  imageUrl: string;
  order?: number;
}

interface MentorsProps {
  data: TeamMember[];
}

export function Mentors({ data: teamMembers }: MentorsProps) {
  const mentors = teamMembers
    .filter((member) => member.role === 'mentor')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (mentors.length === 0) {
    return (
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Mentors
              </h2>
            </div>
            <p className="text-slate-500">No mentor information available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Mentors
            </h2>
          </div>
          <p className="text-slate-400">
            Guided by accomplished leaders and spiritual masters
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-600/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-500/30 bg-blue-500/10">
                  <Image
                    src={mentor.imageUrl}
                    alt={mentor.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{mentor.name}</h3>
                <p className="text-sm text-blue-400 mb-4">{mentor.title}</p>
                {mentor.description && (
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
                    {mentor.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
