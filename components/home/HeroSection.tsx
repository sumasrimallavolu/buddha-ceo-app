'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Star, Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  timings: string;
  imageUrl: string;
  status: string;
}

interface EventResponse {
  success: boolean;
  events?: Event[];
}

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [upcomingEvent, setUpcomingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchUpcomingEvent();
  }, []);

  const fetchUpcomingEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events/public?priority=upcoming&limit=1');
      const data: EventResponse = await response.json();

      if (data.success && data.events && data.events.length > 0) {
        setUpcomingEvent(data.events[0]);
      }
    } catch (error) {
      console.error('Error fetching upcoming event:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatEndDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  // Show event card only if we have an upcoming event
  const showEventCard = !loading && upcomingEvent;

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
          poster="https://i.pinimg.com/736x/1a/ae/25/1aae257b99319cf659fce88e9a50c265.jpg"
        >
          <source
            src="https://i.pinimg.com/736x/61/79/8a/61798a14ac09807a9e8e630c031f5c5c.jpg"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20 lg:py-24">
        <div className={`grid gap-6 lg:gap-12 items-center max-w-7xl mx-auto grid-cols-1 max-w-4xl`}>
          {/* Left Content */}
          <div className={`space-y-6 sm:space-y-8 text-center mx-auto`} style={{ opacity: 1 - scrollY / 500 }}>
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-sm text-blue-400 text-sm font-medium border border-white/10 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all ${!showEventCard ? 'mx-auto' : ''}`}>
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Transform Your Life Through Meditation</span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
              Discover Inner Peace &{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-violet-400 bg-clip-text text-transparent font-bold">
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
                      <stop offset="100%" stopColor="#a78bfa" />

                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed pl-5  py-3 rounded-r-lg">
            Join our meditation programs designed using science and ancient wisdom.
            Perfect for anyone seeking peace, clarity, and self-growth.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center`}>
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
            <div className={`flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-6 justify-center`}>
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
