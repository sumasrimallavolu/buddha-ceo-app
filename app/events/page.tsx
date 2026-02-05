'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RegistrationForm } from '@/components/events/RegistrationForm';
import { NearbyEventsMap } from '@/components/events/NearbyEventsMap';
import { Calendar, Users, Filter, Loader2, Sparkles } from 'lucide-react';

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
}

const getEventTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    beginner_online: 'Beginner Online',
    beginner_physical: 'Beginner Physical',
    advanced_online: 'Advanced Online',
    advanced_physical: 'Advanced Physical',
    conference: 'Conference',
  };
  return labels[type] || type;
};

const getEventTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    beginner_online: '🌱',
    beginner_physical: '🏛️',
    advanced_online: '🚀',
    advanced_physical: '⭐',
    conference: '🎯',
  };
  return icons[type] || '🧘';
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
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events/public');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-slate-950">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md text-blue-400 text-sm font-medium border border-white/10 mb-6">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Upcoming Programs</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-tight">
              Events &{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Programs
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto border-l-4 border-blue-500/40 pl-6">
              Discover our upcoming meditation programs and register for
              transformative experiences that will change your life
            </p>
          </div>
        </section>

        {/* Events Grid & Filters */}
        <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
              <h2 className="text-3xl font-semibold text-white">
                {filterType === 'all' ? 'All Events' : getEventTypeLabel(filterType)}
              </h2>
              <div className="flex items-center gap-3 flex-wrap bg-white/5 backdrop-blur-md p-2 rounded-xl border border-white/10">
                <Filter className="h-4 w-4 text-blue-400" />
                <div className="flex gap-2 flex-wrap">
                  {['all', 'beginner_online', 'advanced_online', 'beginner_physical', 'conference'].map((type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilterType(type)}
                      className={
                        filterType === type
                          ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all'
                          : 'hover:bg-white/10 text-slate-400 hover:text-white transition-all'
                      }
                    >
                      {type === 'all' ? 'All' : getEventTypeLabel(type)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive">{error}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400">No events found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => {
                  const availableSlots = event.maxParticipants
                    ? event.maxParticipants - event.currentRegistrations
                    : null;
                  const isFullyBooked = availableSlots === 0;

                  return (
                    <Card
                      key={event._id}
                      className="group overflow-hidden hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-500 flex flex-col border border-white/10 hover:border-white/30 hover:-translate-y-1 bg-white/5 backdrop-blur-md rounded-3xl"
                      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                    >
                      <div className="relative aspect-video bg-gradient-to-br from-blue-500/15 via-violet-500/20 to-emerald-500/15 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Badge
                          className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 shadow-lg"
                        >
                          {getEventTypeLabel(event.type)}
                        </Badge>
                        {event.status === 'ongoing' && (
                          <Badge className="absolute top-4 left-4 bg-emerald-500 text-white border-0 shadow-lg animate-pulse">
                            Ongoing
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="flex-1 pb-4">
                        <h3 className="font-semibold text-xl mb-3 group-hover:text-blue-400 transition-colors text-white">
                          {event.title}
                        </h3>
                        <div className="space-y-2 text-sm text-slate-400">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-blue-400" />
                            {formatDate(event.startDate)} - {formatDate(event.endDate)}
                          </div>
                          <div>{event.timings}</div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-emerald-400" />
                            {event.maxParticipants ? (
                              <span
                                className={
                                  isFullyBooked
                                    ? 'text-destructive font-semibold'
                                    : availableSlots !== null && availableSlots < 20
                                    ? 'text-blue-400 font-semibold'
                                    : 'text-emerald-400 font-semibold'
                                }
                              >
                                {event.currentRegistrations} / {event.maxParticipants} registered
                                {availableSlots !== null && (
                                  <span className="ml-1 text-slate-400">
                                    ({availableSlots} slots left)
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-semibold">{event.currentRegistrations} registered</span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-4">
                        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-4 border-t border-white/10">
                        {event.status === 'completed' ? (
                          <Button variant="outline" className="w-full border-white/10 text-slate-400" disabled>
                            ✨ Completed
                          </Button>
                        ) : event.status === 'cancelled' ? (
                          <Button variant="outline" className="w-full border-white/10 text-slate-400" disabled>
                            Cancelled
                          </Button>
                        ) : isFullyBooked ? (
                          <Button variant="outline" className="w-full border-destructive/50 text-destructive" disabled>
                            🔥 Fully Booked
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-500/90 hover:to-violet-500/90 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                            onClick={() => handleRegisterClick(event)}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Register Now
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Nearby Events Map */}
        <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute inset-x-0 top-1/4 mx-auto w-80 sm:w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-3 tracking-tight">
                Find Events Near You
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Explore nearby meditation programs and in-person gatherings designed to support your journey.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
              <NearbyEventsMap />
            </div>
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
