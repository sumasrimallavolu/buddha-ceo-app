'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Mail, Phone, MapPin, Calendar } from 'lucide-react';
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
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'free':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Event Registrations
          </DialogTitle>
          <DialogDescription>
            Registrations for: {eventTitle}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Card className="flex-1">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{registrations.length}</div>
                  <div className="text-sm text-gray-500">Total Registrations</div>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-green-600">
                    {registrations.filter(r => r.status === 'confirmed').length}
                  </div>
                  <div className="text-sm text-gray-500">Confirmed</div>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {registrations.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </CardContent>
              </Card>
            </div>

            {registrations.length > 0 && (
              <Button variant="outline" onClick={exportToCSV}>
                Export to CSV
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No registrations yet for this event
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
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
                    <TableRow key={registration._id}>
                      <TableCell className="font-medium">{registration.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {registration.email}
                          </div>
                          {registration.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              {registration.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {registration.city && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {registration.city}
                          </div>
                        )}
                        {registration.profession && (
                          <div className="text-xs text-gray-500">{registration.profession}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(registration.status)}>
                          {registration.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusBadgeColor(registration.paymentStatus)}>
                          {registration.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {new Date(registration.registeredAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
