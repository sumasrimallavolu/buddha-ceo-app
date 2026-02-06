'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Brain, Heart, Target, Users, Award, Loader2, Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  timings: string;
  imageUrl: string;
  status: string;
  location?: {
    city?: string;
    venue?: string;
  };
}

interface EventsResponse {
  success: boolean;
  events?: Event[];
  total?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const iconMap: { [key: string]: any } = {
  Sparkles,
  Brain,
  Heart,
  Target,
  Users,
  Award
};

export function ProgramsServices() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/events/public?status=upcoming&limit=3&sort=startDate');
      const data: EventsResponse = await response.json();

      if (data.success && data.events) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getIcon = (index: number) => {
    const icons = [Sparkles, Brain, Heart, Target, Users, Award];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-400">Loading programs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden" aria-labelledby="programs-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-sm font-semibold mb-4">
            🎯 Our Programs
          </span>
          <h2 id="programs-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Transformative Programs & Services
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Scientifically designed programs combining ancient wisdom with modern understanding for lasting transformation
          </p>
        </motion.div>

        {/* Programs Grid */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
            role="status"
            aria-live="polite"
          >
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-600" aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-white mb-3">No Programs Available</p>
            <p className="text-slate-400 mb-6">Check back soon for new upcoming programs!</p>
            <Link href="/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2"
              >
                View All Events
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {events.map((event, index) => {
                const Icon = getIcon(index);
                return (
                  <motion.div
                    key={event._id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="group relative"
                  >
                    <div className="h-full bg-slate-800 rounded-3xl border border-slate-700 p-6 hover:border-blue-600 transition-all duration-500">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>

                      {/* Features - Event Details */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>{event.timings}</span>
                        </div>
                        {event.location?.city && (
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Users className="w-4 h-4 text-blue-400" />
                            <span>{event.location.city}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                        <div>
                          <span className="text-xs text-slate-500">Event Type</span>
                          <div className="text-sm font-bold text-blue-400 capitalize">
                            {event.type.replace(/_/g, ' ')}
                          </div>
                        </div>
                        <Link href={`/events#${event._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                          >
                            Learn More
                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* View All Programs CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-16"
            >
              <Link href="/events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition-all duration-300 inline-flex items-center gap-3"
                >
                  Explore All Programs
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <p className="text-slate-500 mt-4 text-sm">
                New programs starting every month • Flexible schedules available
              </p>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
