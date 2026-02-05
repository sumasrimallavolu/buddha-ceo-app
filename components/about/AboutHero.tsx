'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Heart, Users, Leaf } from 'lucide-react';

export function AboutHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-slate-950">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Nature Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          poster="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-sea-1925-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/80" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-24">
        {/* Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-110 shadow-lg">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-110 shadow-lg">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-110 shadow-lg">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            opacity: 1 - scrollY / 500,
          }}
        >
          About{' '}
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            Us
          </span>
        </h1>

        {/* Description */}
        <p
          className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed border-l-4 border-blue-500/40 pl-6 bg-white/5 backdrop-blur-sm py-4 rounded-r-lg"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: 1 - scrollY / 600,
          }}
        >
          Empowering individuals and organizations through transformative
          meditation wisdom and techniques, backed by ancient wisdom and modern
          science.
        </p>
      </div>
    </section>
  );
}
