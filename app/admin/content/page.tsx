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
import { FilePlus, MoreVertical, Eye, Edit, Send, Check, X, Trash, FileText, Clock, CheckCircle, XCircle, Archive } from 'lucide-react';
import { ContentCreateModal, ContentEditModal } from '@/components/admin';

interface Content {
  _id: string;
  title: string;
  type: string;
  status: string;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const contentTypes = [
  'photo_collage',
  'video_content',
  'book_publication',
  'mixed_media',
  'poster',
  'testimonial',
  'team_member',
  'achievement',
  'service',
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export default function ContentPage() {
  const { data: session } = useSession();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const canReview = session?.user?.role === 'admin' || session?.user?.role === 'content_reviewer';
  const canEdit = session?.user?.role === 'content_manager';
  const canDelete = session?.user?.role === 'content_manager';

  useEffect(() => {
    fetchContent();
  }, [filterStatus, filterType]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (session?.user?.role === 'content_reviewer' && filterStatus === 'all') {
        params.append('status', 'pending_review');
      } else if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      if (filterType !== 'all') params.append('type', filterType);

      const response = await fetch(`/api/admin/content?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        setError('Failed to fetch content');
      }
    } catch (error) {
      setError('An error occurred while fetching content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForReview = async (contentId: string) => {
    setActionLoading(contentId);
    try {
      const response = await fetch(`/api/admin/content/${contentId}/submit`, {
        method: 'POST',
      });

      if (response.ok) {
        setContent(content.map((c) =>
          c._id === contentId ? { ...c, status: 'pending_review' } : c
        ));
      } else {
        setError('Failed to submit content for review');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (contentId: string) => {
    setActionLoading(contentId);
    try {
      const response = await fetch(`/api/admin/content/${contentId}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        setContent(content.map((c) =>
          c._id === contentId ? { ...c, status: 'published' } : c
        ));
      } else {
        setError('Failed to approve content');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (contentId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setActionLoading(contentId);
    try {
      const response = await fetch(`/api/admin/content/${contentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        setContent(content.map((c) =>
          c._id === contentId ? { ...c, status: 'draft' } : c
        ));
      } else {
        setError('Failed to reject content');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }

    setActionLoading(contentId);
    try {
      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContent(content.filter((c) => c._id !== contentId));
      } else {
        setError('Failed to delete content');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: FileText,
        };
      case 'pending_review':
        return {
          label: 'Pending Review',
          className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: Clock,
        };
      case 'published':
        return {
          label: 'Published',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle,
        };
      case 'archived':
        return {
          label: 'Archived',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: Archive,
        };
      default:
        return {
          label: status,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: FileText,
        };
    }
  };

  const getTypeLabel = (type: string) => {
    return type.split('_').map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const availableStatusOptions = session?.user?.role === 'content_reviewer'
    ? statusOptions.filter(s => s.value === 'all' || s.value === 'pending_review')
    : statusOptions;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-slate-400">
            {canReview ? 'Review and approve website content' : 'Manage and review all website content'}
            {session?.user?.role === 'content_reviewer' && (
              <span className="ml-2 text-sm text-amber-400">(Showing pending review only)</span>
            )}
          </p>
        </div>
        {canEdit && (
          <ContentCreateModal
            trigger={
              <Button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                <FilePlus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            }
            onSuccess={fetchContent}
          />
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Status</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {availableStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-slate-300">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Type</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                <SelectItem value="all" className="text-slate-300">All Types</SelectItem>
                {contentTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-slate-300">
                    {getTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            Content ({content.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-400 font-medium">Title</TableHead>
                <TableHead className="text-slate-400 font-medium">Type</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium">Created By</TableHead>
                <TableHead className="text-slate-400 font-medium">Created</TableHead>
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
              ) : content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">
                      {session?.user?.role === 'content_reviewer'
                        ? 'No pending content to review'
                        : 'No content found'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                content.map((item) => {
                  const statusBadge = getStatusBadge(item.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <TableRow key={item._id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{item.title}</TableCell>
                      <TableCell className="text-slate-400">{getTypeLabel(item.type)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">{item.createdBy?.name || 'Unknown'}</TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                            <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                              <a href={`/admin/content/review/${item._id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                {item.status === 'pending_review' ? 'Review' : 'View'}
                              </a>
                            </DropdownMenuItem>

                            {canEdit && item.status === 'draft' && (
                              <ContentEditModal
                                contentId={item._id}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                }
                                onSuccess={fetchContent}
                              />
                            )}

                            {canEdit && item.status === 'draft' && (
                              <DropdownMenuItem
                                onClick={() => handleSubmitForReview(item._id)}
                                disabled={actionLoading === item._id}
                                className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10"
                              >
                                <Send className="mr-2 h-4 w-4" />
                                {actionLoading === item._id ? 'Submitting...' : 'Submit for Review'}
                              </DropdownMenuItem>
                            )}

                            {canReview && item.status === 'pending_review' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleApprove(item._id)}
                                  disabled={actionLoading === item._id}
                                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 focus:bg-emerald-500/10"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  {actionLoading === item._id ? 'Approving...' : 'Approve'}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleReject(item._id)}
                                  disabled={actionLoading === item._id}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  {actionLoading === item._id ? 'Rejecting...' : 'Reject'}
                                </DropdownMenuItem>
                              </>
                            )}

                            {canDelete && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(item._id)}
                                disabled={actionLoading === item._id}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {actionLoading === item._id ? 'Deleting...' : 'Delete'}
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
