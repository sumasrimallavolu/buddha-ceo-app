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
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'read':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'responded':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
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
        <DialogContent className="sm:max-w-2xl bg-slate-950 border-white/10">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-between pb-4">
            <div>
              <DialogTitle className="text-white text-lg">Message Details</DialogTitle>
              <DialogDescription className="text-slate-400">Full message from contact form</DialogDescription>
            </div>
            {message && (
              <Badge className={`${getStatusBadgeColor(message.status)} border-0`}>
                {getStatusIcon(message.status)}
                <span className="ml-1 capitalize">{message.status}</span>
              </Badge>
            )}
          </div>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <div className="space-y-6 py-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Name</label>
                <p className="text-base font-medium text-white">{message.name}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email</label>
                <p className="text-base text-slate-300">{message.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Subject</label>
              <p className="text-base font-medium text-white">{message.subject}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Message</label>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-base text-slate-300 whitespace-pre-wrap leading-relaxed">{message.message}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Received</label>
              <p className="text-base text-slate-300">{new Date(message.createdAt).toLocaleString()}</p>
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/10">
              {message.status === 'new' && (
                <Button
                  variant="outline"
                  onClick={handleMarkAsRead}
                  disabled={actionLoading}
                  className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <MailOpen className="mr-2 h-4 w-4" />
                  {actionLoading ? 'Marking...' : 'Mark as Read'}
                </Button>
              )}
              {message.status !== 'responded' && (
                <Button
                  className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-blue-500/25"
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
                className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
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
