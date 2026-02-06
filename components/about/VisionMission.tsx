'use client';

import { useEffect, useState } from 'react';
import { Eye, Target, Loader2 } from 'lucide-react';

interface VisionMission {
  vision: string;
  mission: string;
}

export function VisionMission() {
  const [data, setData] = useState<VisionMission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about?section=visionMission');
        const result = await response.json();

        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching vision/mission:', error);
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

  if (!data) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Vision Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-600/50 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/20">
                <Eye className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            </div>
            <p className="text-slate-400 leading-relaxed">{data.vision}</p>
          </div>

          {/* Mission Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-emerald-600/50 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20">
                <Target className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            </div>
            <p className="text-slate-400 leading-relaxed">{data.mission}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
