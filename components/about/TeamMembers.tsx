'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useContentType } from '@/lib/hooks/useDynamicContent';
import { Loader2 } from 'lucide-react';

interface TeamMemberData {
  _id: string;
  title: string;
  content: {
    role?: string;
    bio?: string;
    image?: string;
    quote?: string;
    linkedin?: string;
  };
}

const fallbackTeamMembers = [
  {
    name: 'Dr. Chandra Pulamarasetti',
    role: 'Founder & CEO',
    image: '/images/team/chandra.jpg',
    bio: 'Former corporate leader turned meditation master, dedicated to bringing meditation wisdom to leaders worldwide.',
  },
  {
    name: 'Padma Shri Dr. RV Ramani',
    role: 'Founder and Managing Trustee, Sankara Eye Foundation',
    image: '/images/team/ramani.jpg',
    quote: '"We are that infinite energy with unlimited capability. The entire world is one big family. Meditation helps us to realize these concepts and live them."',
  },
  {
    name: 'Dr. S.V. Balasubramaniam',
    role: 'Founder and Chairman, Bannari Amman Group',
    image: '/images/team/balasubramaniam.jpg',
    quote: '"Meditation has been transformative for both personal growth and professional excellence."',
  },
  {
    name: 'Padma Shri D. R. Kaarthikeyan',
    role: 'Former Director-CBI, NHRC, CRPF',
    image: '/images/team/kaarthikeyan.jpg',
    quote: '"Meditation brings clarity, focus, and inner strength to face life\'s challenges."',
  },
];

export function TeamMembers() {
  const { data: teamMembersData, loading, error } = useContentType('team_member');

  // Transform dynamic content to team member format
  const teamMembers = teamMembersData.map((item: TeamMemberData) => ({
    name: item.title,
    role: item.content.role || 'Team Member',
    image: item.content.image || '/images/team/default.jpg',
    bio: item.content.bio,
    quote: item.content.quote,
    linkedin: item.content.linkedin,
  }));

  // Use fallback data if no dynamic content available
  const displayMembers = teamMembers.length > 0 ? teamMembers : fallbackTeamMembers;

  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Our Team</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Led by experienced professionals and meditation practitioners.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayMembers.map((member, index) => (
              <Card
                key={member.name || index}
                className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/10 shadow-lg bg-white/5 backdrop-blur-md"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-violet-500/30 bg-violet-500/10">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                        {member.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-white">{member.name}</h3>
                  <p className="text-sm text-emerald-400 mb-3 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-sm text-slate-400 mb-2">{member.bio}</p>
                  )}
                  {member.quote && (
                    <p className="text-sm italic text-slate-400 leading-relaxed">
                      "{member.quote}"
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
