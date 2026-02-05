import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';

// This will be replaced with actual data from the API
const recentEvents = [
  {
    id: 1,
    title: 'Vibe - Meditation for Confidence',
    type: 'beginner_online' as const,
    startDate: new Date('2025-11-10'),
    endDate: new Date('2025-12-19'),
    timings: '7:00 to 8:00 AM IST',
    maxParticipants: 500,
    currentRegistrations: 127,
    image: '/images/events/vibe.jpg',
  },
  {
    id: 2,
    title: 'Renew - Excellence through Meditation',
    type: 'advanced_online' as const,
    startDate: new Date('2026-01-26'),
    endDate: new Date('2026-03-06'),
    timings: '6:30 to 7:30 AM IST',
    maxParticipants: 300,
    currentRegistrations: 89,
    image: '/images/events/renew.jpg',
  },
  {
    id: 3,
    title: '2nd Global Conference 2025',
    type: 'conference' as const,
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-03-17'),
    timings: '9:00 AM - 6:00 PM',
    maxParticipants: 1000,
    currentRegistrations: 456,
    image: '/images/events/conference.jpg',
    status: 'completed' as const,
  },
];

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

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export function RecentEvents() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f08_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f08_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-16 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-white">
              Upcoming Events
            </h2>
            <p className="text-lg text-slate-400">
              Join our transformative meditation programs
            </p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10 hover:border-white/30 shadow-sm hover:shadow-lg hover:shadow-blue-500/10">
              View All Events
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentEvents.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden transition-all duration-500 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.03]"
            >
              <div className="relative aspect-video bg-gradient-to-br from-blue-500/20 to-violet-500/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🧘</div>
                </div>
                <Badge
                  className="absolute top-4 right-4 bg-gradient-to-r from-blue-500/90 to-violet-500/90 backdrop-blur-sm hover:from-blue-600 hover:to-violet-600 text-white shadow-md border-0"
                  variant={event.status === 'completed' ? 'secondary' : 'default'}
                >
                  {getEventTypeLabel(event.type)}
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <h3 className="font-bold text-xl mb-3 group-hover:text-blue-400 transition-colors text-white">
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
                    {event.currentRegistrations} / {event.maxParticipants}{' '}
                    registered
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="pt-0">
                {event.status !== 'completed' && (
                  <Button
                    asChild
                    className="w-full shadow-md hover:shadow-lg hover:shadow-blue-500/25 transition-shadow bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
                  >
                    <Link href={`/events/${event.id}`}>
                      Register Now
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
