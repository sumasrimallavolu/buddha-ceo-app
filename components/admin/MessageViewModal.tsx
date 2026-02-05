'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MailOpen, Mail, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface MessageViewModalProps {
  messageId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onStatusChange?: () => void;
}

export function MessageViewModal({
  messageId,
  trigger,
  open: controlledOpen,
  onOpenChange,
  onStatusChange,
}: MessageViewModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = (value: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(value);
    } else {
      setOpen(value);
    }
  };

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch message');
      }

      setMessage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch message');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && messageId) {
      fetchMessage();
      setError('');
    }
  }, [isOpen, messageId]);

  const handleMarkAsRead = async () => {
    if (message?.status === 'read' || message?.status === 'responded') return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });

      if (response.ok) {
        setMessage({ ...message, status: 'read' });
        if (onStatusChange) onStatusChange();
      } else {
        setError('Failed to update message');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsResponded = async () => {
    if (message?.status === 'responded') return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'responded' }),
      });

      if (response.ok) {
        setMessage({ ...message, status: 'responded' });
        if (onStatusChange) onStatusChange();
      } else {
        setError('Failed to update message');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-emerald-100 text-emerald-800';
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

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">Message Details</DialogTitle>
              <DialogDescription>Full message from contact form</DialogDescription>
            </div>
            {message && (
              <Badge className={getStatusBadgeColor(message.status)}>
                {getStatusIcon(message.status)}
                <span className="ml-1">{message.status}</span>
              </Badge>
            )}
          </div>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-base font-medium">{message.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-base">{message.email}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Subject</label>
              <p className="text-base font-medium">{message.subject}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Message</label>
              <div className="mt-1 p-4 bg-gray-50 rounded-lg border">
                <p className="text-base whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Received</label>
              <p className="text-base">{new Date(message.createdAt).toLocaleString()}</p>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              {message.status === 'new' && (
                <Button
                  variant="outline"
                  onClick={handleMarkAsRead}
                  disabled={actionLoading}
                >
                  <MailOpen className="mr-2 h-4 w-4" />
                  {actionLoading ? 'Marking...' : 'Mark as Read'}
                </Button>
              )}
              {message.status !== 'responded' && (
                <Button
                  className="bg-green-600"
                  onClick={handleMarkAsResponded}
                  disabled={actionLoading}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {actionLoading ? 'Marking...' : 'Mark as Responded'}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => window.location.href = `mailto:${message.email}`}
              >
                Reply via Email
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
