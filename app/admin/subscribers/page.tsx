'use client';

import { useEffect, useState } from 'react';
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
import { Mail, MailCheck, MailX, Trash } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface Subscriber {
  _id: string;
  email: string;
  status: string;
  subscribedAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
          <p className="mt-2 text-gray-600">
            Manage email newsletter subscriptions
          </p>
        </div>
        <Button onClick={exportCSV} variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Subscribers ({subscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <p className="text-gray-500">Loading...</p>
                  </TableCell>
                </TableRow>
              ) : subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <p className="text-gray-500">No subscribers found</p>
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber._id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      {subscriber.status === 'active' ? (
                        <Badge className="bg-green-100 text-green-800">
                          <MailCheck className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          <MailX className="h-3 w-3 mr-1" />
                          Unsubscribed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(subscriber.subscribedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
