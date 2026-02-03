'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Heart, Users } from 'lucide-react';

export function AboutHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-800 via-indigo-800/30 to-purple-800/20">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
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

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-purple-900/15 to-indigo-900/20" />

        {/* Animated Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
        {/* Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-110">
            <Heart className="w-8 h-8 text-pink-400" />
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-110">
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all hover:scale-110">
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
          <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-gradient bg-gradient-to-r">
            Us
          </span>
        </h1>

        {/* Description */}
        <p
          className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed border-l-4 border-purple-400/50 pl-6"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: 1 - scrollY / 600,
          }}
        >
          Empowering individuals and organizations through transformative
          meditation wisdom and techniques, backed by ancient wisdom and modern
          science.
        </p>

        {/* Stats */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: 1 - scrollY / 700,
          }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
              15+
            </div>
            <div className="text-white/80">Years of Service</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
              100K+
            </div>
            <div className="text-white/80">Lives Transformed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
            <div className="text-4xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-2">
              500+
            </div>
            <div className="text-white/80">Programs Conducted</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
