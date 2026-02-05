'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User } from 'lucide-react';
import { useState } from 'react';

const founders = [
  {
    name: 'Founder Name',
    role: 'Founder & Chief Inspiration Officer',
    highlight:
      'Visionary leader who brought together meditation wisdom, corporate experience, and service to society.',
    image: '/images/people/founder-1.jpg',
  },
  {
    name: 'Co‑Founder / Trustee Name',
    role: 'Co‑Founder & Managing Trustee',
    highlight:
      'Oversees governance, transparency, and long-term sustainability of the institute and its projects.',
    image: '/images/people/founder-2.jpg',
  },
];

const trusteesNotes = [
  'Collectively guide the strategic direction, ethics, and financial stewardship of the institute.',
  'Ensure that all programs stay aligned with the core meditation lineage and values.',
  'Support large-scale initiatives such as conferences, retreats, and social impact projects.',
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function FoundersTrustees() {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Founders & Trustees
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Visionary Leadership
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Inspired by meditation teachings, our founding team brings together deep practice, corporate leadership, and heartfelt commitment to service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {founders.map((person, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Decorative background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-50" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full opacity-30" />

              <CardContent className="relative pt-10 pb-8 px-8 flex flex-col items-center text-center">
                {/* Profile Image with elegant border */}
                <div className="relative mb-5">
                  <div className="w-32 h-32 rounded-full bg-blue-500/20 p-1 shadow-xl border border-blue-500/30">
                    <div className="w-full h-full rounded-full bg-blue-500/10 flex items-center justify-center overflow-hidden relative">
                      {imageErrors[index] ? (
                        <div className="w-full h-full rounded-full bg-blue-500/30 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">{getInitials(person.name)}</span>
                        </div>
                      ) : (
                        <Image
                          src={person.image}
                          alt={person.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                          onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                        />
                      )}
                    </div>
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute -inset-2 rounded-full border-2 border-dashed border-blue-400/40 opacity-40 animate-[spin_10s_linear_infinite]" />
                </div>

                {/* Name and Role */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-1.5 text-white">
                    {person.name}
                  </h3>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide border border-emerald-500/30">
                    {person.role}
                  </div>
                </div>

                {/* Description with subtle quote styling */}
                <div className="relative">
                  <div className="absolute -top-2 -left-3 text-4xl text-blue-400/30 font-serif">"</div>
                  <p className="text-sm text-slate-400 leading-relaxed relative z-10">
                    {person.highlight}
                  </p>
                  <div className="absolute -bottom-4 -right-3 text-4xl text-blue-400/30 font-serif">"</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trustees Card */}
        <Card className="border border-white/10 shadow-lg bg-gradient-to-br from-white/5 to-slate-900/40 backdrop-blur-md">
          <CardContent className="pt-10 pb-10 px-8 md:flex md:items-start md:gap-8">
            <div className="mb-6 md:mb-0 md:mt-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 shadow-lg border border-blue-500/30">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3 text-white">
                Board of Trustees
              </h3>
              <p className="text-sm text-slate-500 mb-5 font-medium">
                Guiding our mission with wisdom and integrity
              </p>
              <ul className="space-y-4 text-sm text-slate-400 leading-relaxed">
                {trusteesNotes.map((note, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="flex-1">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

