'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Sparkles } from 'lucide-react';

interface Inspiration {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

export function Inspiration() {
  const [data, setData] = useState<Inspiration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about?section=inspiration');
        const result = await response.json();

        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching inspiration:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-amber-400" />
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
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-amber-500/30 shadow-xl">
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
                <p className="text-amber-400 font-medium mb-4">
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
