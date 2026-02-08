'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface Inspiration {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

interface InspirationProps {
  data: Inspiration | null;
}

export function Inspiration({ data }: InspirationProps) {
  if (!data) {
    return (
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Our Inspiration
              </h2>
            </div>
            <p className="text-slate-500">No inspiration data available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Our Inspiration
              </h2>
            </div>
            <p className="text-slate-400">Guided by a visionary master</p>
          </div>

          {/* Content Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Image */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-blue-500/30 shadow-xl">
                  <Image
                    src={data.imageUrl}
                    alt={data.name}
                    width={224}
                    height={224}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {data.name}
                </h3>
                <p className="text-blue-400 font-medium mb-4">
                  {data.title}
                </p>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  {data.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
