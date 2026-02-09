'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EventFeedback } from '@/components/events/EventFeedback';
import { FeedbackForm } from '@/components/events/FeedbackForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  _id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  timings: string;
  imageUrl?: string;
  maxParticipants?: number;
  currentRegistrations: number;
  status: string;
  location?: {
    online?: boolean;
    city?: string;
    venue?: string;
  };
  teacherName?: string;
  benefits?: string[];
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const initParams = async () => {
      const { id } = await params;
      const eventId = Array.isArray(id) ? id[0] : id;
      if (eventId) {
        fetchEvent(eventId);
        checkRegistration(eventId);
      }
    };
    initParams();
  }, [params]);

  const fetchEvent = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/public/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch event');
      }

      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async (eventId: string) => {
    if (!session?.user?.email) {
      setIsRegistered(false);
      return;
    }

    try {
      const response = await fetch(`/api/registrations?eventId=${eventId}`);
      const data = await response.json();

      if (data.success) {
        setIsRegistered(data.registered || false);
      } else {
        console.error('Registration check failed:', data.error);
        setIsRegistered(false);
      }
    } catch (err) {
      console.error('Error checking registration:', err);
      setIsRegistered(false);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const isEventEnded = () => {
    if (!event) return false;
    return new Date() > new Date(event.endDate);
  };

  const isEventFull = () => {
    if (!event || !event.maxParticipants) return false;
    return event.currentRegistrations >= event.maxParticipants;
  };

  const isRegistrationClosed = () => {
    if (!event) return true;
    const endDate = new Date(event.endDate);
    const closeTime = new Date(endDate.getTime() - 30 * 60 * 1000); // 30 min before end
    return new Date() > closeTime;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Skeleton className="h-10 w-32 mb-6" />

          <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
            <Skeleton className="w-full h-80" />
            <div className="p-8 space-y-6">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
              <Skeleton className="h-12 w-40 mt-8" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Event Not Found</h1>
            <p className="text-slate-400 mb-8">{error || 'This event does not exist.'}</p>
            <Link href="/events">
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                Browse All Events
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const eventEnded = isEventEnded();
  const eventFull = isEventFull();
  const registrationClosed = isRegistrationClosed();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/events">
          <Button variant="ghost" className="text-slate-400 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>

        {/* Event Header */}
        <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
          {event.imageUrl && (
            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {event.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </Badge>
              {eventEnded && (
                <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                  Event Ended
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              {event.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Start Date</p>
                    <p className="text-white">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-violet-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase">End Date</p>
                    <p className="text-white">{formatDate(event.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Time</p>
                    <p className="text-white">{event.timings}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {event.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-pink-400" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Location</p>
                      <p className="text-white">
                        {event.location.online
                          ? 'Online Event'
                          : event.location.city || event.location.venue || 'TBD'}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Participants</p>
                    <p className="text-white">
                      {event.currentRegistrations}
                      {event.maxParticipants && ` / ${event.maxParticipants}`}
                    </p>
                  </div>
                </div>
                {event.teacherName && (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-400" />
                    <div>
                      <p className="text-xs text-slate-500 uppercase">Teacher</p>
                      <p className="text-white">{event.teacherName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {!isRegistered && !eventEnded && !registrationClosed && !eventFull && (
                <Link href={`/events/${event._id}/register`}>
                  <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                    Register Now
                  </Button>
                </Link>
              )}

              {!isRegistered && eventFull && (
                <Button disabled className="bg-slate-600 text-white cursor-not-allowed">
                  Event Full
                </Button>
              )}

              {!isRegistered && registrationClosed && !eventEnded && (
                <Button disabled className="bg-slate-600 text-white cursor-not-allowed">
                  Registration Closed
                </Button>
              )}

              {isRegistered && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>You're registered for this event</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        {event.benefits && event.benefits.length > 0 && (
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">What You'll Learn</h2>
              <ul className="space-y-3">
                {event.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Feedback Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Feedback & Reviews</h2>
              <p className="text-slate-400">
                See what attendees are saying about this event
              </p>
            </div>
            {eventEnded && isRegistered && !showFeedbackForm && (
              <Button
                onClick={() => setShowFeedbackForm(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Leave Feedback
              </Button>
            )}
          </div>

          {/* Feedback Form Modal */}
          {showFeedbackForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide hover:scrollbar-hide">
                <FeedbackForm
                  eventId={event._id}
                  eventTitle={event.title}
                  eventEndDate={event.endDate}
                  onSuccess={() => {
                    setShowFeedbackForm(false);
                    window.location.reload();
                  }}
                  onCancel={() => setShowFeedbackForm(false)}
                />
              </div>
            </div>
          )}

          {/* Display Feedback */}
          <EventFeedback eventId={event._id} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
