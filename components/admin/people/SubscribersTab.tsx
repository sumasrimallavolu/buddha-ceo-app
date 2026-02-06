'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Mail, MailCheck, MailX, Download, Users, Trash2 } from 'lucide-react';

interface Subscriber {
  _id: string;
  email: string;
  status: string;
  subscribedAt: string;
}

interface SubscribersTabProps {
  canEdit: boolean;
}

export function SubscribersTab({ canEdit }: SubscribersTabProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/subscribers');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      } else {
        setError('Failed to fetch subscribers');
      }
    } catch (error) {
      setError('An error occurred while fetching subscribers');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Email,Status,Subscribed At\n' +
      subscribers
        .map(
          (s) =>
            `${s.email},${s.status},${new Date(s.subscribedAt).toLocaleString()}`
        )
        .join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const handleDelete = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) {
      return;
    }

    setActionLoading(subscriberId);
    try {
      const response = await fetch(`/api/admin/subscribers?id=${subscriberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubscribers(subscribers.filter((s) => s._id !== subscriberId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete subscriber');
      }
    } catch (error) {
      setError('An error occurred while deleting subscriber');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Newsletter Subscribers ({subscribers.length})
        </h2>
        {canEdit && (
          <Button
            onClick={exportCSV}
            className="bg-white/5 hover:bg-white/10 border border-white/20 text-white hover:border-white/30 rounded-xl transition-all"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-400 font-medium">Email</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium">Subscribed At</TableHead>
                {canEdit && <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canEdit ? 4 : 3} className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </TableCell>
                </TableRow>
              ) : subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canEdit ? 4 : 3} className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No subscribers found</p>
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber._id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white">{subscriber.email}</TableCell>
                    <TableCell>
                      {subscriber.status === 'active' ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <MailCheck className="h-3 w-3" />
                          Active
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">
                          <MailX className="h-3 w-3" />
                          Unsubscribed
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(subscriber.subscribedAt).toLocaleString()}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(subscriber._id)}
                          disabled={actionLoading === subscriber._id}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
