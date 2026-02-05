'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
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
            src="https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/80" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8" style={{ opacity: 1 - scrollY / 500 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm text-blue-400 text-sm font-medium border border-white/10 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Transform Your Life Through Meditation</span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
              Discover Inner Peace &{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent font-bold">
                  Radiant Health
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10">
                  <path
                    d="M0 5 Q50 1 100 5 T200 5"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    fill="none"
                    className="opacity-50"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="50%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed border-l-4 border-blue-500/60 pl-5 bg-white/5 backdrop-blur-sm py-3 rounded-r-lg">
              Join our scientifically designed meditation programs. Experience
              transformation through ancient wisdom combined with modern understanding.
              Perfect for leaders, professionals, and seekers on the path of self-discovery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <Link href="/events" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  className="w-full sm:w-auto shadow-xl hover:shadow-blue-500/25 text-base sm:text-lg bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 border border-blue-400/30"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base sm:text-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:shadow-lg hover:shadow-white/10 border-white/20 text-white hover:border-white/30"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-6">
              <div className="flex -space-x-3 sm:-space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  alt="Student"
                  className="w-14 h-14 rounded-full border-2 border-slate-900 object-cover hover:scale-110 hover:z-10 transition-all shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                  alt="Student"
                  className="w-14 h-14 rounded-full border-2 border-slate-900 object-cover hover:scale-110 hover:z-10 transition-all shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
                  alt="Student"
                  className="w-14 h-14 rounded-full border-2 border-slate-900 object-cover hover:scale-110 hover:z-10 transition-all shadow-lg"
                />
                <div className="w-14 h-14 rounded-full border-2 border-slate-900 bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  +50K
                </div>
              </div>
              <div className="text-sm text-slate-400 text-center sm:text-left">
                <span className="font-bold text-2xl text-blue-400">
                  50,000+
                </span>{' '}
                lives transformed
              </div>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  40+
                </div>
                <div className="text-sm text-slate-400 mt-1">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">
                  100K+
                </div>
                <div className="text-sm text-slate-400 mt-1">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400">
                  15+
                </div>
                <div className="text-sm text-slate-400 mt-1">Years</div>
              </div>
            </div>
          </div>

          {/* Right Side - Enrollment Card */}
          <div className="relative order-first lg:order-last">
            <div
              className="aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-xl rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 p-[10px] shadow-2xl border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform duration-500"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
              <div className="w-full h-full rounded-3xl overflow-hidden relative bg-gradient-to-br from-slate-900 to-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80"
                  alt="Peaceful meditation in nature"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-bold mb-4 shadow-lg border border-blue-400/30">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    NOW ENROLLING
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 drop-shadow-lg">
                    Vibe - Meditation for Confidence
                  </h3>
                  <p className="text-slate-200 mb-4 text-base sm:text-lg max-w-md drop-shadow">
                    40-Day Online Program for Youth & Students
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-slate-300 mb-6">
                    <span className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      📅 Feb 15 - Mar 28, 2025
                    </span>
                    <span className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      ⏰ 7-8 AM IST
                    </span>
                  </div>
                  <Link href="/events" className="block">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white w-full shadow-2xl text-base sm:text-lg py-6 border border-emerald-400/30"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Register Now - FREE
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2 bg-white/5 backdrop-blur-sm shadow-md">
          <div className="w-1.5 h-3 bg-gradient-to-b from-blue-400 to-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
