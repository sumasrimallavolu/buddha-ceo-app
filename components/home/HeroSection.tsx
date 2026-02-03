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
    <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-gradient-to-br from-peach-100 via-peach-100/80 to-peach-100/70">
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
        <div className="absolute inset-0 bg-gradient-to-b from-purple-200/30 via-pink-200/20 to-blue-200/40" />

        {/* Animated Orbs - Pastel */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl"
          style={{
            transform: `translate(-50%, -50%) translateY(${scrollY * 0.3}px)`,
          }}
        ></div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 text-gray-800" style={{ opacity: 1 - scrollY / 500 }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/70 backdrop-blur-sm text-purple-700 text-sm font-medium border border-purple-200/50 hover:bg-white/80 transition-all">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Transform Your Life Through Meditation</span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-800">
              Discover Inner Peace &{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
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
            <p className="text-sm sm:text-base text-gray-700 max-w-2xl leading-relaxed border-l-4 border-purple-400/60 pl-4">
              Join our scientifically designed meditation programs. Experience
              transformation through ancient wisdom combined with modern understanding.
              Perfect for leaders, professionals, and seekers on the path of self-discovery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/events" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-base sm:text-lg px-6 sm:px-8 border border-white/30"
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
                  className="w-full sm:w-auto border-2 border-purple-400 text-purple-700 hover:bg-purple-100 backdrop-blur-sm hover:border-purple-500 transition-all text-base sm:text-lg px-6 sm:px-8 hover:scale-105 bg-white/60"
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
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-white/80 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  +50K
                </div>
              </div>
              <div className="text-sm text-gray-700 text-center sm:text-left">
                <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  50,000+
                </span>{' '}
                lives transformed
              </div>
            </div>

            {/* Stats Counter */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-purple-200/50">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  40+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  100K+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  15+
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Years</div>
              </div>
            </div>
          </div>

          {/* Right Side - Enrollment Card */}
          <div className="relative order-first lg:order-last">
            <div
              className="aspect-[4/3] w-full max-w-lg mx-auto lg:max-w-xl rounded-3xl bg-gradient-to-br from-purple-300/50 via-pink-300/40 to-blue-300/50 backdrop-blur-md p-[10px] shadow-xl border border-white/60 hover:scale-105 transition-transform duration-700"
              style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
              <div className="w-full h-full rounded-3xl overflow-hidden relative bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
                <img
                  src="https://images.unsplash.com/photo-1523419409543-3e4f83b9b9f4?w=1200&q=80"
                  alt="Meditation by the ocean"
                  className="w-full h-full object-cover opacity-70"
                />
                {/* Color wash over image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-300/60 via-pink-300/50 to-blue-300/60 mix-blend-multiply" />
                {/* Soft light highlight */}
                <div className="pointer-events-none absolute -top-24 right-0 w-72 h-72 bg-pink-300/40 rounded-full blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 -left-16 w-64 h-64 bg-purple-300/40 rounded-full blur-3xl" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-gray-800">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm text-xs font-bold mb-3 shadow-lg text-white">
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
                    <span className="bg-white/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-purple-200">
                      📅 Feb 15 - Mar 28, 2025
                    </span>
                    <span className="bg-white/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-purple-200">
                      ⏰ 7-8 AM IST
                    </span>
                  </div>
                  <Link href="/events" className="block">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-full shadow-xl hover:scale-105 transition-all text-base sm:text-lg border border-white/30 py-6"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Register Now - FREE
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Testimonial Cards */}
            <div
              className="absolute -top-6 -left-4 sm:-left-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl max-w-[240px] hidden lg:block hover:scale-105 transition-all duration-300 border border-purple-200"
              style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="https://i.ytimg.com/vi/9QSKyMf98uY/default.jpg"
                  alt="Indrani"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-300"
                />
                <div>
                  <p className="font-semibold text-xs text-gray-900">Indrani K. Mohan</p>
                  <p className="text-xs text-purple-600 font-medium">10/10 in Boards</p>
                </div>
              </div>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "Achieved perfect scores through meditation! The program transformed my focus and clarity."
              </p>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-pink-400 text-xs">⭐</span>
                ))}
              </div>
            </div>

            <div
              className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl max-w-[240px] hidden lg:block hover:scale-105 transition-all duration-300 border border-pink-200"
              style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="https://i.ytimg.com/vi/_5NTRAnF-Ic/default.jpg"
                  alt="Raji"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-300"
                />
                <div>
                  <p className="font-semibold text-xs text-gray-900">Raji Iyengar</p>
                  <p className="text-xs text-pink-600 font-medium">Senior Leader</p>
                </div>
              </div>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "From vertigo to victory through meditation! Completely healed in 40 days."
              </p>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-purple-400 text-xs">⭐</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex items-start justify-center p-2 bg-white/20 backdrop-blur-sm">
          <div className="w-1 h-3 bg-purple-500/70 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
