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
import { MoreVertical, Mail, MailOpen, Check, Trash, CheckCircle, Clock, Inbox } from 'lucide-react';
import { MessageViewModal } from '@/components/admin';

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
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const canDelete = session?.user?.role === 'admin';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return {
          label: 'New',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: Mail,
        };
      case 'read':
        return {
          label: 'Read',
          className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: MailOpen,
        };
      case 'responded':
        return {
          label: 'Responded',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: CheckCircle,
        };
      default:
        return {
          label: status,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: Mail,
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Contact Messages</h1>
        <p className="text-slate-400">
          Manage inquiries from the contact form
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Messages Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            All Messages ({messages.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium">Name</TableHead>
                <TableHead className="text-slate-400 font-medium">Email</TableHead>
                <TableHead className="text-slate-400 font-medium">Subject</TableHead>
                <TableHead className="text-slate-400 font-medium">Received</TableHead>
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
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Inbox className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No messages found</p>
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => {
                  const statusBadge = getStatusBadge(message.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <TableRow key={message._id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">{message.name}</TableCell>
                      <TableCell className="text-slate-400">{message.email}</TableCell>
                      <TableCell className="text-slate-400 max-w-xs truncate">{message.subject}</TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                            <MessageViewModal
                              messageId={message._id}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                                  <MailOpen className="mr-2 h-4 w-4" />
                                  View Full Message
                                </DropdownMenuItem>
                              }
                              onStatusChange={fetchMessages}
                            />

                            {message.status !== 'responded' && (
                              <DropdownMenuItem
                                onClick={() => handleMarkAsResponded(message._id)}
                                disabled={actionLoading === message._id}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 focus:bg-blue-500/10"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                {actionLoading === message._id ? 'Marking...' : 'Mark as Responded'}
                              </DropdownMenuItem>
                            )}

                            {canDelete && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(message._id)}
                                disabled={actionLoading === message._id}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {actionLoading === message._id ? 'Deleting...' : 'Delete'}
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
