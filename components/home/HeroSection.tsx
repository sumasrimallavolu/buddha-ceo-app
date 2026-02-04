'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-peach-100">
      {/* Video Background with Minimal Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {/* MP4 Video Background - Meditation/Peaceful Nature */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Soft Overlay for better text readability */}
        <div className="absolute inset-0 bg-purple-100/30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 text-gray-800" style={{ opacity: 1 - scrollY / 500 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 text-purple-700 text-sm font-medium border border-purple-200/50 hover:bg-white transition-all">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Transform Your Life Through Meditation</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-800">
              Discover Inner Peace &{' '}
              <span className="relative">
                <span className="text-purple-600 font-bold">
                  Radiant Health
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8">
                  <path
                    d="M0 4 Q50 0 100 4 T200 4"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    className="opacity-60"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-900 max-w-2xl leading-relaxed border-l-4 border-purple-400/60 pl-4">
              Join our scientifically designed meditation programs. Experience
              transformation through ancient wisdom combined with modern understanding.
              Perfect for leaders, professionals, and seekers on the path of self-discovery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/events" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-purple-900 hover:bg-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-base sm:text-lg px-6 sm:px-8"
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
                  className="w-full sm:w-auto border-2 border-purple-400 text-purple-700 hover:bg-purple-100 hover:border-purple-500 transition-all text-base sm:text-lg px-6 sm:px-8 hover:scale-105 bg-white"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-4 sm:pt-6">
              <div className="flex -space-x-3 sm:-space-x-4">
                <img
                  src="https://i.ytimg.com/vi/MSUXw7Dxle8/default.jpg"
                  alt="Student"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-white/80 object-cover hover:scale-110 hover:z-10 transition-all shadow-lg"
                />
                <img
                  src="https://i.ytimg.com/vi/s4vH34O7rOs/default.jpg"
                  alt="Student"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-white/80 object-cover hover:scale-110 hover:z-10 transition-all shadow-lg"
                />
                <img
                  src="https://i.ytimg.com/vi/9QSKyMf98uY/default.jpg"
                  alt="Student"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-white/80 object-cover hover:scale-110 hover:z-10 transition-all shadow-lg"
                />
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-white/80 bg-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  +50K
                </div>
              </div>
              <div className="text-sm text-gray-900 text-center sm:text-left">
                <span className="font-bold text-xl sm:text-2xl text-purple-600">
                  50,000+
                </span>{' '}
                lives transformed
              </div>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-purple-200/50">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                  40+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  100K+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-pink-600">
                  15+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Years</div>
              </div>
            </div>
          </div>

          {/* Right Side - Enrollment Card */}
          <div className="relative order-first lg:order-last">
            <div
              className="aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-xl rounded-3xl bg-purple-200/50 p-[10px] shadow-xl border border-white/60 hover:scale-105 transition-transform duration-700"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
              <div className="w-full h-full rounded-3xl overflow-hidden relative bg-purple-100">
                <img
                  src="https://images.unsplash.com/photo-1523419409543-3e4f83b9b9f4?w=1200&q=80"
                  alt="Meditation by the ocean"
                  className="w-full h-full object-cover opacity-70"
                />
                {/* Color wash over image */}
                <div className="absolute inset-0 bg-purple-300/60 mix-blend-multiply" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-gray-800">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-600 text-xs font-bold mb-3 shadow-lg text-white">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    NOW ENROLLING
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 drop-shadow-lg">
                    Vibe - Meditation for Confidence
                  </h3>
                  <p className="text-gray-800 mb-4 text-base sm:text-lg max-w-md">
                    40-Day Online Program for Youth & Students
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-700 mb-6">
                    <span className="bg-white/90 px-2.5 py-1 rounded-full border border-purple-200">
                      📅 Feb 15 - Mar 28, 2025
                    </span>
                    <span className="bg-white/90 px-2.5 py-1 rounded-full border border-purple-200">
                      ⏰ 7-8 AM IST
                    </span>
                  </div>
                  <Link href="/events" className="block">
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white w-full shadow-xl hover:scale-105 transition-all text-base sm:text-lg py-6"
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
        <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex items-start justify-center p-2 bg-white/40">
          <div className="w-1 h-3 bg-purple-500/70 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
