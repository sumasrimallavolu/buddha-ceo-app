'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, MessageSquare, Image as ImageIcon, Calendar, User, Mail, Check, X, Loader2 } from 'lucide-react';

interface Feedback {
  _id: string;
  eventId: {
    _id: string;
    title: string;
  };
  userId?: string;
  userName: string;
  userEmail: string;
  type: 'rating' | 'comment' | 'photo';
  status: 'pending' | 'approved' | 'rejected';
  rating?: number;
  comment?: string;
  photoUrl?: string;
  photoCaption?: string;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

interface FeedbackViewModalProps {
  feedback: Feedback;
  trigger: React.ReactNode;
  onApprove?: (id: string, notes?: string) => void;
  onReject?: (id: string, notes?: string) => void;
  actionLoading?: string | null;
  canModerate?: boolean;
}

export function FeedbackViewModal({
  feedback,
  trigger,
  onApprove,
  onReject,
  actionLoading,
  canModerate = false,
}: FeedbackViewModalProps) {
  const [open, setOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState(feedback.adminNotes || '');

  const handleApprove = () => {
    if (onApprove) {
      onApprove(feedback._id, adminNotes);
      if (!actionLoading) {
        setOpen(false);
      }
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(feedback._id, adminNotes);
      if (!actionLoading) {
        setOpen(false);
      }
    }
  };

  const renderContent = () => {
    if (feedback.type === 'rating') {
      return (
        <div className="flex items-center justify-center gap-2 py-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-12 w-12 ${
                star <= (feedback.rating || 0)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-600'
              }`}
            />
          ))}
        </div>
      );
    } else if (feedback.type === 'comment') {
      return (
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <MessageSquare className="h-8 w-8 text-blue-400 mb-4" />
          <p className="text-slate-200 whitespace-pre-wrap text-lg leading-relaxed">
            {feedback.comment}
          </p>
        </div>
      );
    } else if (feedback.type === 'photo') {
      return (
        <div className="space-y-4">
          {feedback.photoUrl && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden border border-white/10">
              <Image
                src={feedback.photoUrl}
                alt="Event photo"
                fill
                className="object-cover"
              />
            </div>
          )}
          {feedback.photoCaption && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-slate-200 italic">"{feedback.photoCaption}"</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Feedback Details</DialogTitle>
          <DialogDescription className="text-slate-400">
            Review and moderate feedback from event attendees
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* User Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-4">
              <User className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-500 uppercase">Submitted By</p>
                <p className="text-white font-medium">{feedback.userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-lg p-4">
              <Mail className="h-5 w-5 text-violet-400" />
              <div>
                <p className="text-xs text-slate-500 uppercase">Email</p>
                <p className="text-white font-medium text-sm">{feedback.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Event Info */}
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-4">
            <Calendar className="h-5 w-5 text-emerald-400" />
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase">Event</p>
              <p className="text-white font-medium">{feedback.eventId?.title || 'Unknown Event'}</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <Label className="text-slate-300 text-sm">Feedback Content</Label>
            {renderContent()}
          </div>

          {/* Admin Review Info */}
          {(feedback.reviewedBy || feedback.reviewedAt) && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <span className="font-medium">Reviewed by:</span> {feedback.reviewedBy}
              </p>
              <p className="text-xs text-blue-400 mt-1">
                {feedback.reviewedAt && new Date(feedback.reviewedAt).toLocaleString()}
              </p>
            </div>
          )}

          {/* Admin Notes Input */}
          {canModerate && feedback.status === 'pending' && (
            <div className="space-y-2">
              <Label htmlFor="adminNotes" className="text-slate-300">
                Admin Notes (optional)
              </Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes about this feedback..."
                rows={3}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Existing Admin Notes Display */}
          {feedback.adminNotes && !canModerate && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-xs text-slate-500 uppercase mb-2">Admin Notes</p>
              <p className="text-slate-300">{feedback.adminNotes}</p>
            </div>
          )}

          {/* Action Buttons */}
          {canModerate && feedback.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button
                onClick={handleReject}
                disabled={actionLoading === feedback._id}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {actionLoading === feedback._id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </>
                )}
              </Button>
              <Button
                onClick={handleApprove}
                disabled={actionLoading === feedback._id}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {actionLoading === feedback._id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Status Message for Non-Moderators */}
          {!canModerate && feedback.status === 'pending' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <p className="text-yellow-400 text-sm">
                Only admins, content managers, and reviewers can approve or reject feedback
              </p>
            </div>
          )}

          {/* Already Reviewed Message */}
          {feedback.status !== 'pending' && (
            <div className={`${
              feedback.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
            } rounded-lg p-4 text-center`}>
              <p className={`${
                feedback.status === 'approved' ? 'text-emerald-400' : 'text-red-400'
              } text-sm font-medium`}>
                {feedback.status === 'approved' ? '✓ This feedback has been approved' : '✕ This feedback has been rejected'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
