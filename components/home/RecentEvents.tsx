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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Upcoming Events
            </h2>
            <p className="text-lg text-muted-foreground">
              Join our transformative meditation programs
            </p>
          </div>
          <Link href="/events">
            <Button variant="outline">View All Events</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentEvents.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-blue-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🧘</div>
                </div>
                <Badge
                  className="absolute top-4 right-4"
                  variant={event.status === 'completed' ? 'secondary' : 'default'}
                >
                  {getEventTypeLabel(event.type)}
                </Badge>
              </div>
              <CardHeader>
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
                    {event.currentRegistrations} / {event.maxParticipants}{' '}
                    registered
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                {event.status !== 'completed' && (
                  <Link href={`/events/${event.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
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
