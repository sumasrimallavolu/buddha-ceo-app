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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FeedbackViewModal } from '@/components/admin/FeedbackViewModal';
import {
  MoreVertical,
  Star,
  MessageSquare,
  Image as ImageIcon,
  Check,
  X,
  Trash,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
} from 'lucide-react';

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

export default function EventFeedbackPage() {
  const { data: session } = useSession();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Roles that can approve/reject
  const canModerate = session?.user?.role === 'admin' ||
                      session?.user?.role === 'content_manager' ||
                      session?.user?.role === 'content_reviewer';

  // Only admin can delete
  const canDelete = session?.user?.role === 'admin';

  useEffect(() => {
    fetchFeedbacks();
  }, [statusFilter, typeFilter]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const response = await fetch(`/api/admin/event-feedback?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedbacks || []);
      } else {
        setError('Failed to fetch feedback');
      }
    } catch (error) {
      setError('An error occurred while fetching feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (feedbackId: string, adminNotes?: string) => {
    setActionLoading(feedbackId);
    try {
      const response = await fetch(`/api/admin/event-feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          adminNotes: adminNotes || '',
        }),
      });

      if (response.ok) {
        setFeedbacks(feedbacks.map((f) =>
          f._id === feedbackId
            ? {
                ...f,
                status: 'approved',
                adminNotes,
                reviewedBy: session?.user?.email || '',
                reviewedAt: new Date().toISOString(),
              }
            : f
        ));
      } else {
        setError('Failed to approve feedback');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (feedbackId: string, adminNotes?: string) => {
    setActionLoading(feedbackId);
    try {
      const response = await fetch(`/api/admin/event-feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          adminNotes: adminNotes || '',
        }),
      });

      if (response.ok) {
        setFeedbacks(feedbacks.map((f) =>
          f._id === feedbackId
            ? {
                ...f,
                status: 'rejected',
                adminNotes,
                reviewedBy: session?.user?.email || '',
                reviewedAt: new Date().toISOString(),
              }
            : f
        ));
      } else {
        setError('Failed to reject feedback');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }

    setActionLoading(feedbackId);
    try {
      const response = await fetch(`/api/admin/event-feedback/${feedbackId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFeedbacks(feedbacks.filter((f) => f._id !== feedbackId));
      } else {
        setError('Failed to delete feedback');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'rating':
        return {
          label: 'Rating',
          className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: Star,
        };
      case 'comment':
        return {
          label: 'Comment',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: MessageSquare,
        };
      case 'photo':
        return {
          label: 'Photo',
          className: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
          icon: ImageIcon,
        };
      default:
        return {
          label: type,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: MessageSquare,
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: Clock,
        };
      case 'approved':
        return {
          label: 'Approved',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle,
        };
      case 'rejected':
        return {
          label: 'Rejected',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: XCircle,
        };
      default:
        return {
          label: status,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: Clock,
        };
    }
  };

  const getFeedbackPreview = (feedback: Feedback) => {
    if (feedback.type === 'rating') {
      return (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
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
        <p className="text-slate-300 line-clamp-2 max-w-md">
          {feedback.comment}
        </p>
      );
    } else if (feedback.type === 'photo') {
      return (
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-violet-400" />
          <span className="text-slate-300 text-sm">
            {feedback.photoCaption || 'Photo submission'}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Event Feedback</h1>
          <p className="text-slate-400">
            Review and moderate feedback from event attendees
          </p>
        </div>
        <Button
          onClick={fetchFeedbacks}
          variant="outline"
          className="border-white/10 text-slate-300 hover:bg-white/5"
        >
          <Filter className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-xs">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 max-w-xs">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="rating">Ratings</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="photo">Photos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            All Feedback ({feedbacks.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium">Type</TableHead>
                <TableHead className="text-slate-400 font-medium">User</TableHead>
                <TableHead className="text-slate-400 font-medium">Event</TableHead>
                <TableHead className="text-slate-400 font-medium">Content</TableHead>
                <TableHead className="text-slate-400 font-medium">Submitted</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </TableCell>
                </TableRow>
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No feedback found</p>
                  </TableCell>
                </TableRow>
              ) : (
                feedbacks.map((feedback) => {
                  const typeBadge = getTypeBadge(feedback.type);
                  const statusBadge = getStatusBadge(feedback.status);
                  const TypeIcon = typeBadge.icon;
                  const StatusIcon = statusBadge.icon;

                  return (
                    <TableRow key={feedback._id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${typeBadge.className}`}>
                          <TypeIcon className="h-3 w-3" />
                          {typeBadge.label}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-white">{feedback.userName}</p>
                          <p className="text-xs text-slate-500">{feedback.userEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-slate-300 max-w-xs truncate">
                          {feedback.eventId?.title || 'Unknown Event'}
                        </p>
                      </TableCell>
                      <TableCell>
                        {getFeedbackPreview(feedback)}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                            <FeedbackViewModal
                              feedback={feedback}
                              trigger={
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              }
                              onApprove={handleApprove}
                              onReject={handleReject}
                              actionLoading={actionLoading}
                              canModerate={canModerate}
                            />

                            {canModerate && feedback.status === 'pending' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleApprove(feedback._id)}
                                  disabled={actionLoading === feedback._id}
                                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 focus:bg-emerald-500/10"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  {actionLoading === feedback._id ? 'Approving...' : 'Approve'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleReject(feedback._id)}
                                  disabled={actionLoading === feedback._id}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  {actionLoading === feedback._id ? 'Rejecting...' : 'Reject'}
                                </DropdownMenuItem>
                              </>
                            )}

                            {canDelete && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(feedback._id)}
                                disabled={actionLoading === feedback._id}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {actionLoading === feedback._id ? 'Deleting...' : 'Delete'}
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
