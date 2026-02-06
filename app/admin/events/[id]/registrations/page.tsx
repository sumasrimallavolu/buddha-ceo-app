'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Mail, Phone, MapPin, Calendar, ArrowLeft, Download, Clock } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  profession?: string;
  status: string;
  paymentStatus: string;
  registeredAt: string;
}

export default function EventRegistrationsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eventTitle, setEventTitle] = useState('');

  useEffect(() => {
    fetchEventDetails();
    fetchRegistrations();
  }, [params.id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/admin/events/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEventTitle(data.title);
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
    }
  };

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/events/${params.id}/registrations`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch registrations');
      }

      setRegistrations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'free':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Profession', 'Status', 'Payment Status', 'Registered Date'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        reg.name,
        reg.email,
        reg.phone || '',
        reg.city || '',
        reg.profession || '',
        reg.status,
        reg.paymentStatus,
        new Date(reg.registeredAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${eventTitle.replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/events">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">Event Registrations</h1>
          <p className="text-slate-400">
            Registrations for: {eventTitle || 'Loading...'}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-400">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Registrations</p>
                <p className="text-3xl font-bold text-white">{registrations.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Confirmed</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {registrations.filter(r => r.status === 'confirmed').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-sm font-semibold">
                  {Math.round((registrations.filter(r => r.status === 'confirmed').length / Math.max(registrations.length, 1)) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-400">
                  {registrations.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Showing {registrations.length} registration{registrations.length !== 1 ? 's' : ''}
        </div>
        {registrations.length > 0 && (
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
        )}
      </div>

      {/* Registrations Table */}
      {loading ? (
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </div>
      ) : registrations.length === 0 ? (
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-12">
          <div className="text-center">
            <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No registrations yet for this event</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5 bg-white/5">
                  <TableHead className="text-slate-400 font-medium">Name</TableHead>
                  <TableHead className="text-slate-400 font-medium">Contact</TableHead>
                  <TableHead className="text-slate-400 font-medium">Location</TableHead>
                  <TableHead className="text-slate-400 font-medium">Profession</TableHead>
                  <TableHead className="text-slate-400 font-medium">Status</TableHead>
                  <TableHead className="text-slate-400 font-medium">Payment</TableHead>
                  <TableHead className="text-slate-400 font-medium">Registered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration._id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{registration.name}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="text-slate-300">{registration.email}</span>
                        </div>
                        {registration.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-300">{registration.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {registration.city && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span className="text-slate-300">{registration.city}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-300">{registration.profession || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(registration.status)} border-0 capitalize`}>
                        {registration.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPaymentStatusBadgeColor(registration.paymentStatus)} border-0 capitalize`}>
                        {registration.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-300">{new Date(registration.registeredAt).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
