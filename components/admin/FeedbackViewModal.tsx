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
import { Video, MessageSquare, Image as ImageIcon, Calendar, User, Mail, Check, X, Loader2, Play } from 'lucide-react';

interface Feedback {
  _id: string;
  eventId: {
    _id: string;
    title: string;
  };
  userId?: string;
  userName: string;
  userEmail: string;
  type: 'video' | 'comment' | 'photo';
  status: 'pending' | 'approved' | 'rejected';
  videoUrl?: string;
  videoCaption?: string;
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
    if (feedback.type === 'video') {
      return (
        <div className="space-y-4">
          {feedback.videoUrl && (
            <div className="relative w-full rounded-xl overflow-hidden border-2 border-white/20 bg-black group">
              {/* Video element */}
              <div className="relative aspect-video w-full bg-gradient-to-br from-slate-900 to-slate-800">
                <video
                  src={feedback.videoUrl}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain"
                  preload="metadata"
                  poster=""
                >
                  <source src={feedback.videoUrl} />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video type indicator */}
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <Video className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-medium text-white">Video</span>
                </div>
              </div>

              {/* Play button overlay - shows when paused */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm transition-all">
                  <Play className="w-6 h-6 text-blue-600 ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
          )}
          {feedback.videoCaption && (
            <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-xl p-5 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-300 uppercase font-semibold mb-1">Caption</p>
                  <p className="text-white italic leading-relaxed">"{feedback.videoCaption}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else if (feedback.type === 'comment') {
      return (
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-emerald-300 uppercase font-semibold mb-2">Comment</p>
              <p className="text-white whitespace-pre-wrap text-lg leading-relaxed">
                {feedback.comment}
              </p>
            </div>
          </div>
        </div>
      );
    } else if (feedback.type === 'photo') {
      return (
        <div className="space-y-4">
          {feedback.photoUrl && (
            <div className="relative h-80 w-full rounded-xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-slate-900 to-slate-800">
              <Image
                src={feedback.photoUrl}
                alt="Event photo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 768px"
              />
              <div className="absolute top-3 right-3">
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <ImageIcon className="h-4 w-4 text-violet-400" />
                  <span className="text-xs font-medium text-white">Photo</span>
                </div>
              </div>
            </div>
          )}
          {feedback.photoCaption && (
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-5 border border-violet-500/20">
              <div className="flex items-start gap-3">
                <ImageIcon className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-violet-300 uppercase font-semibold mb-1">Caption</p>
                  <p className="text-white italic leading-relaxed">"{feedback.photoCaption}"</p>
                </div>
              </div>
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
