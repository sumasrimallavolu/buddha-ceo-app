'use client';

import { useState, useEffect } from 'react';
import { Heart, Users, Leaf, Loader2 } from 'lucide-react';

interface WhoWeAre {
  title: string;
  description: string;
}

export function AboutHero() {
  const [data, setData] = useState<WhoWeAre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about?section=whoWeAre');
        const result = await response.json();

        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching who we are:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="relative py-16 overflow-hidden bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
        </div>
      </section>
    );
  }

  const title = data?.title || 'About Us';
  const description = data?.description ||
    'Empowering individuals and organizations through transformative meditation wisdom and techniques.';

  return (
    <section className="relative py-16 overflow-hidden bg-slate-950">
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-sea-1925-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Icons Row */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="bg-blue-500/20 backdrop-blur-sm p-3 rounded-xl border border-blue-500/30">
            <Heart className="w-6 h-6 text-blue-400" />
          </div>
          <div className="bg-violet-500/20 backdrop-blur-sm p-3 rounded-xl border border-violet-500/30">
            <Leaf className="w-6 h-6 text-violet-400" />
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-sm p-3 rounded-xl border border-emerald-500/30">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
}
