'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Users } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  title: string;
  role: 'founder' | 'co_founder' | 'trustee' | 'mentor' | 'steering_committee';
  description?: string;
  imageUrl: string;
  order?: number;
}

export function Founders() {
  const [founders, setFounders] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about?section=teamMembers');
        const result = await response.json();

        if (result.success && result.data) {
          const foundersData = result.data
            .filter(
              (member: TeamMember) => member.role === 'founder' || member.role === 'co_founder'
            )
            .sort((a: TeamMember, b: TeamMember) => (a.order || 0) - (b.order || 0));
          setFounders(foundersData);
        }
      } catch (error) {
        console.error('Error fetching founders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  if (founders.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-violet-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Leadership
            </h2>
          </div>
          <p className="text-slate-400">
            Led by successful entrepreneurs and corporate leaders
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {founders.map((founder) => (
            <div
              key={founder._id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-violet-600/50 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-violet-500/30 bg-violet-500/10">
                  <Image
                    src={founder.imageUrl}
                    alt={founder.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{founder.name}</h3>
                <p className="text-sm text-violet-400 mb-4">{founder.title}</p>
                {founder.description && (
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
                    {founder.description}
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
