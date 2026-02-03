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
        <section className="bg-gradient-to-br from-purple-600 to-blue-600 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Events & Programs
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Discover our upcoming meditation programs and register for
              transformative experiences
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl font-bold">
                {filterType === 'all' ? 'All Events' : getEventTypeLabel(filterType)}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {['all', 'beginner_online', 'advanced_online', 'beginner_physical', 'conference'].map((type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType(type)}
                      className={filterType === type ? 'bg-purple-600' : ''}
                    >
                      {type === 'all' ? 'All' : getEventTypeLabel(type)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nearby Events Map */}
            <div className="mb-8">
              <NearbyEventsMap />
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
                {filteredEvents.map((event) => {
                  const availableSlots = event.maxParticipants
                    ? event.maxParticipants - event.currentRegistrations
                    : null;
                  const isFullyBooked = availableSlots === 0;

                  return (
                    <Card
                      key={event._id}
                      className="group overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                    >
                      <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-blue-100">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-6xl">{getEventTypeIcon(event.type)}</div>
                        </div>
                        <Badge
                          className="absolute top-4 right-4"
                          variant={event.status === 'completed' ? 'secondary' : 'default'}
                        >
                          {getEventTypeLabel(event.type)}
                        </Badge>
                        {event.status === 'ongoing' && (
                          <Badge className="absolute top-4 left-4 bg-green-600">
                            Ongoing
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="flex-1">
                        <h3 className="font-bold text-xl mb-2 group-hover:text-purple-600 transition-colors">
                          {event.title}
                        </h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatDate(event.startDate)} - {formatDate(event.endDate)}
                          </div>
                          <div>{event.timings}</div>
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {event.maxParticipants ? (
                              <span
                                className={
                                  isFullyBooked
                                    ? 'text-red-600 font-medium'
                                    : availableSlots !== null && availableSlots < 20
                                    ? 'text-orange-600 font-medium'
                                    : ''
                                }
                              >
                                {event.currentRegistrations} / {event.maxParticipants} registered
                                {availableSlots !== null && (
                                  <span className="ml-1">
                                    ({availableSlots} slots left)
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span>{event.currentRegistrations} registered</span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {event.description}
                        </p>
                      </CardContent>
                      <CardFooter>
                        {event.status === 'completed' ? (
                          <Button variant="outline" className="w-full" disabled>
                            Completed
                          </Button>
                        ) : event.status === 'cancelled' ? (
                          <Button variant="outline" className="w-full" disabled>
                            Cancelled
                          </Button>
                        ) : isFullyBooked ? (
                          <Button variant="outline" className="w-full" disabled>
                            Fully Booked
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                            onClick={() => handleRegisterClick(event)}
                          >
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

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Contact us to learn about upcoming programs or to request a custom meditation workshop
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              Contact Us
            </a>
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
