'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RegistrationForm } from '@/components/events/RegistrationForm';
import { Calendar, Users, Filter, Loader2, MapPin, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  timings: string;
  imageUrl: string;
  maxParticipants?: number;
  currentRegistrations: number;
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

const getEventTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    beginner_online: 'Beginner Online',
    beginner_physical: 'Beginner In-Person',
    advanced_online: 'Advanced Online',
    advanced_physical: 'Advanced In-Person',
    conference: 'Conference',
    retreat: 'Retreat',
    workshop: 'Workshop',
  };
  return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events/public');
        const data: EventsResponse = await response.json();

        if (data.success && data.events) {
          setEvents(data.events);
          setFilteredEvents(data.events);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.type === filterType));
    }
  }, [filterType, events]);

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setRegistrationOpen(true);
  };

  // Get unique event types
  const eventTypes = Array.from(new Set(events.map((e) => e.type)));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Golden Ratio: 1:1.618 */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-slate-950">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium border border-blue-500/30 mb-6">
              <Calendar className="w-4 h-4" />
              <span>Transformative Programs</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Events &{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Programs
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Discover our meditation programs designed for your transformation journey
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-slate-900/50 border-y border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-white">
                <Filter className="h-5 w-5 text-blue-400" />
                <span className="font-semibold">
                  {filterType === 'all' ? 'All Programs' : getEventTypeLabel(filterType)}
                </span>
                <span className="text-slate-400">({filteredEvents.length})</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  All
                </button>
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {getEventTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid - Golden Ratio Layout */}
        <section className="py-16 bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                <p className="text-slate-400">Check back soon for new programs!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => {
                  const availableSlots = event.maxParticipants
                    ? event.maxParticipants - event.currentRegistrations
                    : null;
                  const isFullyBooked = availableSlots === 0;
                  const isCompleted = event.status === 'completed';

                  return (
                    <Card
                      key={event._id}
                      className="group overflow-hidden border border-white/10 hover:border-blue-600/50 transition-all duration-300 bg-white/5 backdrop-blur-sm hover:-translate-y-1"
                      id={event._id}
                    >
                      {/* Image - Aspect ratio ~1.618 (Golden Ratio) */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                        <Image
                          src={event.imageUrl || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80"}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                        {/* Status Badge */}
                        {event.status === 'upcoming' && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium backdrop-blur-sm">
                              Upcoming
                            </span>
                          </div>
                        )}
                        {event.status === 'ongoing' && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-blue-500/90 text-white text-xs font-medium backdrop-blur-sm animate-pulse">
                              Ongoing
                            </span>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-slate-500/90 text-white text-xs font-medium backdrop-blur-sm">
                              Completed
                            </span>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                          {event.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start gap-3 text-sm">
                            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300">
                              {formatDate(event.startDate)} - {formatDate(event.endDate)}
                            </span>
                          </div>
                          <div className="flex items-start gap-3 text-sm">
                            <Clock className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300">{event.timings}</span>
                          </div>
                          {event.location?.city && (
                            <div className="flex items-start gap-3 text-sm">
                              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300">{event.location.city}</span>
                            </div>
                          )}
                          {event.maxParticipants && (
                            <div className="flex items-start gap-3 text-sm">
                              <Users className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="text-slate-300">
                                  {event.currentRegistrations} / {event.maxParticipants}
                                </div>
                                {availableSlots !== null && (
                                  <div className={`text-xs font-medium ${isFullyBooked ? 'text-red-400' : availableSlots < 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {isFullyBooked ? 'Fully Booked' : `${availableSlots} slots left`}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        {isCompleted ? (
                          <Button variant="outline" className="w-full" disabled>
                            Completed
                          </Button>
                        ) : isFullyBooked ? (
                          <Button variant="outline" className="w-full border-red-500/50 text-red-400" disabled>
                            Fully Booked
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
                            onClick={() => handleRegisterClick(event)}
                          >
                            Register Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {selectedEvent && (
        <RegistrationForm
          event={selectedEvent}
          open={registrationOpen}
          onOpenChange={setRegistrationOpen}
        />
      )}
    </div>
  );
}
