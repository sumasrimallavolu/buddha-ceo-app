'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RegistrationForm } from '@/components/events/RegistrationForm';
import { NearbyEventsMap } from '@/components/events/NearbyEventsMap';
import { Calendar, Users, Filter, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-slate-800">
          {/* Video Background */}
          <div className="absolute inset-0 overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1920"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-slate-900/20" />
            <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20 mb-6">
              <Calendar className="w-4 h-4 text-purple-300" />
              <span>Upcoming Programs</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Events &{' '}
              <span className="text-purple-300 drop-shadow-lg">
                Programs
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto border-l-4 border-purple-400/50 pl-6">
              Discover our upcoming meditation programs and register for
              transformative experiences that will change your life
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
              <h2 className="text-3xl font-bold text-purple-600">
                {filterType === 'all' ? 'All Events' : getEventTypeLabel(filterType)}
              </h2>
              <div className="flex items-center gap-3 flex-wrap bg-white/50 backdrop-blur-sm p-2 rounded-xl border border-purple-200">
                <Filter className="h-4 w-4 text-purple-600" />
                <div className="flex gap-2 flex-wrap">
                  {['all', 'beginner_online', 'advanced_online', 'beginner_physical', 'conference'].map((type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilterType(type)}
                      className={
                        filterType === type
                          ? 'bg-purple-600 text-white shadow-lg hover:shadow-xl transition-all'
                          : 'hover:bg-purple-100 transition-all'
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
                <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No events found.</p>
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
                      className="group overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col border-2 border-purple-100 hover:border-purple-300 hover:scale-105 bg-white/50 backdrop-blur-sm"
                      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
                    >
                      <div className="relative aspect-video bg-purple-100 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Badge
                          className="absolute top-4 right-4 bg-purple-600 text-white border-0 shadow-lg"
                        >
                          {getEventTypeLabel(event.type)}
                        </Badge>
                        {event.status === 'ongoing' && (
                          <Badge className="absolute top-4 left-4 bg-green-500 text-white border-0 shadow-lg animate-pulse">
                            Ongoing
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="flex-1 pb-4">
                        <h3 className="font-bold text-xl mb-3 group-hover:text-purple-600 transition-colors">
                          {event.title}
                        </h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center text-gray-700">
                            <Calendar className="mr-2 h-4 w-4 text-purple-600" />
                            {formatDate(event.startDate)} - {formatDate(event.endDate)}
                          </div>
                          <div className="text-gray-700">{event.timings}</div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4 text-blue-600" />
                            {event.maxParticipants ? (
                              <span
                                className={
                                  isFullyBooked
                                    ? 'text-red-600 font-semibold'
                                    : availableSlots !== null && availableSlots < 20
                                    ? 'text-orange-600 font-semibold'
                                    : 'text-green-600 font-semibold'
                                }
                              >
                                {event.currentRegistrations} / {event.maxParticipants} registered
                                {availableSlots !== null && (
                                  <span className="ml-1 text-gray-600">
                                    ({availableSlots} slots left)
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-green-600 font-semibold">{event.currentRegistrations} registered</span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-4">
                        <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                          {event.description}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-4 border-t border-purple-100">
                        {event.status === 'completed' ? (
                          <Button variant="outline" className="w-full" disabled>
                            ✨ Completed
                          </Button>
                        ) : event.status === 'cancelled' ? (
                          <Button variant="outline" className="w-full" disabled>
                            Cancelled
                          </Button>
                        ) : isFullyBooked ? (
                          <Button variant="outline" className="w-full border-red-300 text-red-600" disabled>
                            🔥 Fully Booked
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                            onClick={() => handleRegisterClick(event)}
                          >
                            ✨ Register Now
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
        <section className="py-8 bg-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <NearbyEventsMap />
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
