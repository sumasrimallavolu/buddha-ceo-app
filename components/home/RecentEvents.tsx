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
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600">
              Join our transformative meditation programs
            </p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">View All Events</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentEvents.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden hover:shadow-xl transition-shadow border-purple-100 bg-white/60 backdrop-blur-sm"
            >
              <div className="relative aspect-video bg-gradient-to-br from-purple-200/50 to-pink-200/50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🧘</div>
                </div>
                <Badge
                  className="absolute top-4 right-4 bg-purple-500/80 hover:bg-purple-600 text-white"
                  variant={event.status === 'completed' ? 'secondary' : 'default'}
                >
                  {getEventTypeLabel(event.type)}
                </Badge>
              </div>
              <CardHeader>
                <h3 className="font-bold text-xl mb-2 group-hover:text-purple-600 transition-colors text-gray-800">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>
                  <div>{event.timings}</div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-pink-500" />
                    {event.currentRegistrations} / {event.maxParticipants}{' '}
                    registered
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                {event.status !== 'completed' && (
                  <Link href={`/events/${event.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Register Now
                    </Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
