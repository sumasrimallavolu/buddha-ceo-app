'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FeedbackModal } from '@/components/events/FeedbackModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  LogOut,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Registration {
  registration: {
    id: string;
    status: string;
    paymentStatus: string;
    phone: string;
    city?: string;
    profession?: string;
    registeredAt: string;
  };
  event: {
    id: string;
    title: string;
    description: string;
    type: string;
    startDate: string;
    endDate: string;
    timings: string;
    imageUrl?: string;
    status: string;
    location?: {
      online?: boolean;
      city?: string;
      venue?: string;
    };
    teacherName?: string;
    benefits?: string[];
  } | null;
}

interface RegistrationsResponse {
  success: boolean;
  registrations?: Registration[];
  total?: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackEvent, setFeedbackEvent] = useState<{
    id: string;
    title: string;
    endDate: string;
  } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // Allow 'user' and 'content_reviewer' roles to access user dashboard
      // Redirect admin and content_manager roles to admin dashboard
      if (session?.user?.role && session.user.role !== 'user' && session.user.role !== 'content_reviewer') {
        router.push('/admin');
        return;
      }
      fetchRegistrations();
    }
  }, [status, session, router]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/user/registrations');
      const data: RegistrationsResponse = await response.json();

      if (response.ok && data.success) {
        setRegistrations(data.registrations || []);
      } else {
        setError('Failed to load registrations');
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  const formatDateTime = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

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
    return labels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getStatusBadge = (status: string, eventStatus: string) => {
    const now = new Date();
    const endDate = eventStatus ? new Date() : now;

    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
          <CheckCircle2 className="h-3 w-3" />
          Confirmed
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
          <AlertCircle className="h-3 w-3" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
          <XCircle className="h-3 w-3" />
          Cancelled
        </span>
      );
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isEventEnded = (endDate: string) => {
    return new Date() > new Date(endDate);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-16 w-64" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">My Dashboard</h1>
                <p className="text-xs text-slate-400">
                  Welcome back, {session?.user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  Home
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  Browse Events
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-white/10 text-slate-300 hover:bg-white/5"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info Card */}
        <Card className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {session?.user?.name}
                </h2>
                <p className="text-slate-400">{session?.user?.email}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-400">
                  {registrations.length}
                </div>
                <div className="text-sm text-slate-400">
                  Event{registrations.length !== 1 ? 's' : ''} Registered
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Registrations */}
        {registrations.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Registrations Yet</h3>
              <p className="text-slate-400 mb-6">
                You haven't registered for any events yet. Start exploring our upcoming events!
              </p>
              <Link href="/events">
                <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                  Browse Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {registrations.map(({ registration, event }) => (
              <Card
                key={registration.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:border-blue-600/50 transition-all duration-300"
              >
                {event?.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(registration.status, event.status)}
                    </div>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {event?.title || 'Event Details Not Available'}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {event?.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Event Date</p>
                        <p className="text-white">
                          {event ? formatDate(event.startDate) : 'N/A'} - {event ? formatDate(event.endDate) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                      <Clock className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Time</p>
                        <p className="text-white">{event?.timings || 'N/A'}</p>
                      </div>
                    </div>

                    {event?.location && (
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium uppercase">Location</p>
                          <p className="text-white">
                            {event.location.online
                              ? 'Online Event'
                              : event.location.city || event.location.venue || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 text-sm">
                      <Users className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Registered On</p>
                        <p className="text-white">
                          {formatDate(registration.registeredAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {event && isEventEnded(event.endDate) && (
                      <Button
                        onClick={() => setFeedbackEvent({ id: event.id, title: event.title, endDate: event.endDate })}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Leave Feedback
                      </Button>
                    )}

                    <Link href={`/events/${event?.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                        View Event Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackEvent && (
          <FeedbackModal
            eventId={feedbackEvent.id}
            eventTitle={feedbackEvent.title}
            eventEndDate={feedbackEvent.endDate}
          />
        )}
      </div>
    </div>
  );
}
