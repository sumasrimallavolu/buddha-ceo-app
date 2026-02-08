'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface EventRegistrationsModalProps {
  eventId: string;
  eventTitle: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EventRegistrationsModal({
  eventId,
  eventTitle,
  open: controlledOpen,
  onOpenChange,
}: EventRegistrationsModalProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/events/${eventId}/registrations`);
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

  useEffect(() => {
    if (isOpen && eventId) {
      fetchRegistrations();
    }
  }, [isOpen, eventId]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
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
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
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

  const handleOpenChange = (open: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-2 pb-4">
            <Users className="h-5 w-5 text-white" />
            <div>
              <DialogTitle className="text-white">Event Registrations</DialogTitle>
              <DialogDescription className="text-slate-400">
                Registrations for: {eventTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <Card className="flex-1 bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-white">{registrations.length}</div>
                  <div className="text-sm text-slate-400">Total Registrations</div>
                </CardContent>
              </Card>
              <Card className="flex-1 bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-emerald-400">
                    {registrations.filter(r => r.status === 'confirmed').length}
                  </div>
                  <div className="text-sm text-slate-400">Confirmed</div>
                </CardContent>
              </Card>
              <Card className="flex-1 bg-white/5 border-white/10">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-400">
                    {registrations.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-sm text-slate-400">Pending</div>
                </CardContent>
              </Card>
            </div>

            {registrations.length > 0 && (
              <Button variant="outline" onClick={exportToCSV} className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
                Export to CSV
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No registrations yet for this event
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/5 hover:bg-white/5">
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration._id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{registration.name}</TableCell>
                      <TableCell>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-300">{registration.email}</span>
                          </div>
                          {registration.phone && (
                            <div className="flex items-center gap-2">
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
                        {registration.profession && (
                          <div className="text-xs text-slate-500">{registration.profession}</div>
                        )}
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
          )}
        </div>

        <DialogFooter className="pt-6 border-t border-white/10">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
