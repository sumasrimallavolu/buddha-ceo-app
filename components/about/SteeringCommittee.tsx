'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  title: string;
  role: 'founder' | 'co_founder' | 'trustee' | 'mentor' | 'steering_committee';
  description?: string;
  imageUrl: string;
  order?: number;
}

interface SteeringCommitteeProps {
  data: TeamMember[];
}

export function SteeringCommittee({ data: teamMembers }: SteeringCommitteeProps) {
  const steeringMembers = teamMembers.filter((member) => member.role === 'steering_committee');

  if (steeringMembers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-emerald-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Steering Committee
            </h2>
          </div>
          <p className="text-slate-400">
            Guiding the vision and execution with strategic leadership
          </p>
        </div>

        {/* Committee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steeringMembers.map((member) => (
            <Card
              key={member._id}
              className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/10 shadow-lg bg-white/5 backdrop-blur-md"
            >
              <CardContent className="pt-6 pb-7 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-emerald-500/30 bg-emerald-500/10">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] font-medium uppercase tracking-wide text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full mb-2 border border-emerald-500/30">
                  Steering Committee
                </span>
                <h3 className="text-base font-semibold mb-1 text-white">{member.name}</h3>
                <p className="text-sm text-emerald-400 font-medium mb-2">
                  {member.title}
                </p>
                {member.description && (
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {member.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

