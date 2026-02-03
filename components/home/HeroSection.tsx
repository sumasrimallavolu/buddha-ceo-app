'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Volume2 } from 'lucide-react';
import { useState } from 'react';

export function HeroSection() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/30">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Transform Your Life Through Meditation
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              Discover Inner Peace &{' '}
              <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                Radiant Health
              </span>
            </h1>

            <p className="text-lg text-white/90 max-w-2xl leading-relaxed text-lg">
              Join our scientifically designed meditation programs. Experience
              transformation through ancient wisdom combined with modern understanding.
              Perfect for leaders, professionals, and seekers on the path of self-discovery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/events">
                <Button
                  size="lg"
                  className="bg-white text-purple-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all text-lg px-8"
                >
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/50 text-white hover:bg-white/20 backdrop-blur-sm transition-all text-lg px-8"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-4">
                <img
                  src="https://i.ytimg.com/vi/MSUXw7Dxle8/default.jpg"
                  alt="Student"
                  className="w-12 h-12 rounded-full border-3 border-white object-cover"
                />
                <img
                  src="https://i.ytimg.com/vi/s4vH34O7rOs/default.jpg"
                  alt="Student"
                  className="w-12 h-12 rounded-full border-3 border-white object-cover"
                />
                <img
                  src="https://i.ytimg.com/vi/9QSKyMf98uY/default.jpg"
                  alt="Student"
                  className="w-12 h-12 rounded-full border-3 border-white object-cover"
                />
                <div className="w-12 h-12 rounded-full border-3 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
                  +50K
                </div>
              </div>
              <div className="text-sm text-white/90">
                <span className="font-semibold text-white text-lg">50,000+</span> lives
                transformed
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl bg-white/10 backdrop-blur-md p-1 shadow-2xl border border-white/20">
              <div className="w-full h-full rounded-3xl overflow-hidden relative">
                <img
                  src="https://static.wixstatic.com/media/6add23_c6a79b8fb661467e89d4e6cc5f03289e~mv2.png/v1/crop/x_502,y_0,w_795,h_600/fill/w_600,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/vibe%20bg.png"
                  alt="Vibe Meditation Program"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-xs font-bold mb-3">
                    NOW ENROLLING
                  </div>
                  <h3 className="text-3xl font-bold mb-2">
                    Vibe - Meditation for Confidence
                  </h3>
                  <p className="text-white/90 mb-4">
                    40-Day Online Program for Youth & Students
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
                    <span>📅 Nov 10 - Dec 19, 2025</span>
                    <span>⏰ 7-8 AM IST</span>
                  </div>
                  <Link href="/events">
                    <Button
                      size="lg"
                      className="bg-white text-purple-700 hover:bg-gray-100 w-full"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Register Now - FREE
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating testimonial cards */}
            <div className="absolute -top-8 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl max-w-xs hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="https://i.ytimg.com/vi/9QSKyMf98uY/default.jpg"
                  alt="Indrani"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-gray-900">Indrani Krishna Mohan</p>
                  <p className="text-xs text-gray-600">Scored 10/10 in Boards</p>
                </div>
              </div>
              <p className="text-xs text-gray-700 italic">
                "Achieved perfect scores through meditation!"
              </p>
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl max-w-xs hidden lg:block">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src="https://i.ytimg.com/vi/_5NTRAnF-Ic/default.jpg"
                  alt="Raji"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-gray-900">Raji Iyengar</p>
                  <p className="text-xs text-gray-600">Senior Leader</p>
                </div>
              </div>
              <p className="text-xs text-gray-700 italic">
                "From vertigo to victory through meditation!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
