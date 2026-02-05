'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarPlus, MoreVertical, Edit, Trash, Users } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { EventCreateModal, EventEditModal, EventRegistrationsModal } from '@/components/admin';

interface Event {
  _id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  currentRegistrations: number;
  maxParticipants: number;
}

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrations, setShowRegistrations] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setError('Failed to fetch events');
      }
    } catch (error) {
      setError('An error occurred while fetching events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    setDeleting(eventId);
    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter((e) => e._id !== eventId));
      } else {
        setError('Failed to delete event');
      }
    } catch (error) {
      setError('An error occurred while deleting event');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-emerald-100 text-emerald-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.split('_').map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'content_manager';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="mt-2 text-gray-600">
            Manage meditation programs and events
          </p>
        </div>
        {canEdit && (
          <EventCreateModal
            trigger={
              <Button className="bg-amber-600">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            }
            onSuccess={fetchEvents}
          />
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Events ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">Loading...</p>
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No events found</p>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{getTypeLabel(event.type)}</TableCell>
                    <TableCell>
                      {new Date(event.startDate).toLocaleDateString()} - {' '}
                      {new Date(event.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        {event.currentRegistrations}
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowRegistrations(true);
                            }}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            View Registrations
                          </DropdownMenuItem>

                          {canEdit && (
                            <EventEditModal
                              eventId={event._id}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              }
                              onSuccess={fetchEvents}
                            />
                          )}

                          {canEdit && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(event._id)}
                              disabled={deleting === event._id}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {deleting === event._id ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedEvent && (
        <EventRegistrationsModal
          eventId={selectedEvent._id}
          eventTitle={selectedEvent.title}
          open={showRegistrations}
          onOpenChange={setShowRegistrations}
        />
      )}
    </div>
  );
}
