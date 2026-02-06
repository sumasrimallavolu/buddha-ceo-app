'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarPlus, MoreVertical, Edit, Trash, Users, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { EventCreateModal, EventEditModal } from '@/components/admin';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          label: 'Upcoming',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: Calendar,
        };
      case 'ongoing':
        return {
          label: 'Ongoing',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: Clock,
        };
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: CheckCircle,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: XCircle,
        };
      default:
        return {
          label: status,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: Calendar,
        };
    }
  };

  const getTypeLabel = (type: string) => {
    return type.split('_').map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const canEdit = session?.user?.role === 'content_manager';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Event Management</h1>
          <p className="text-slate-400">
            Manage meditation programs and events
          </p>
        </div>
        {canEdit && (
          <EventCreateModal
            trigger={
              <Button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            }
            onSuccess={fetchEvents}
          />
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Events Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            All Events ({events.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-400 font-medium">Title</TableHead>
                <TableHead className="text-slate-400 font-medium">Type</TableHead>
                <TableHead className="text-slate-400 font-medium">Dates</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium">Registrations</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No events found</p>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => {
                  const statusBadge = getStatusBadge(event.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <TableRow key={event._id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{event.title}</TableCell>
                      <TableCell className="text-slate-400">{getTypeLabel(event.type)}</TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(event.startDate).toLocaleDateString()} - {' '}
                        {new Date(event.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {event.currentRegistrations}
                          {event.maxParticipants && ` / ${event.maxParticipants}`}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                            <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                              <Link href={`/admin/events/${event._id}/registrations`} className="flex items-center w-full">
                                <Users className="mr-2 h-4 w-4" />
                                View Registrations
                              </Link>
                            </DropdownMenuItem>

                            {canEdit && (
                              <EventEditModal
                                eventId={event._id}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                }
                                onSuccess={fetchEvents}
                              />
                            )}

                            {canEdit && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(event._id)}
                                disabled={deleting === event._id}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {deleting === event._id ? 'Deleting...' : 'Delete'}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}
