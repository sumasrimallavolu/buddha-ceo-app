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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Mail, MailOpen, Check, Trash } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/contact-messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (error) {
      setError('An error occurred while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    setActionLoading(messageId);
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });

      if (response.ok) {
        setMessages(messages.map((m) =>
          m._id === messageId ? { ...m, status: 'read' } : m
        ));
      } else {
        setError('Failed to update message');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAsResponded = async (messageId: string) => {
    setActionLoading(messageId);
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'responded' }),
      });

      if (response.ok) {
        setMessages(messages.map((m) =>
          m._id === messageId ? { ...m, status: 'responded' } : m
        ));
      } else {
        setError('Failed to update message');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    setActionLoading(messageId);
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter((m) => m._id !== messageId));
      } else {
        setError('Failed to delete message');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Mail className="h-4 w-4" />;
      case 'read':
        return <MailOpen className="h-4 w-4" />;
      case 'responded':
        return <Check className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="mt-2 text-gray-600">
          Manage inquiries from the contact form
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Messages ({messages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Received</TableHead>
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
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No messages found</p>
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message._id}>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(message.status)}>
                        {getStatusIcon(message.status)}
                        <span className="ml-1">{message.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <MailOpen className="mr-2 h-4 w-4" />
                            View Full Message
                          </DropdownMenuItem>
                          {message.status === 'new' && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsRead(message._id)}
                              disabled={actionLoading === message._id}
                            >
                              <MailOpen className="mr-2 h-4 w-4" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          {message.status !== 'responded' && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsResponded(message._id)}
                              disabled={actionLoading === message._id}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Responded
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(message._id)}
                            disabled={actionLoading === message._id}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            {actionLoading === message._id ? 'Deleting...' : 'Delete'}
                          </DropdownMenuItem>
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
    </div>
  );
}
