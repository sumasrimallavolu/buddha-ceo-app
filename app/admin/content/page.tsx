'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilePlus, MoreVertical, Eye, Edit, Send, Check, X, Trash } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
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
  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'content_manager';
  const canDelete = session?.user?.role === 'admin'; // Only admins can delete content

  useEffect(() => {
    fetchContent();
  }, [filterStatus, filterType]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // Content reviewers should only see pending_review content by default
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.split('_').map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Content reviewers only see pending review, admins can filter
  const availableStatusOptions = session?.user?.role === 'content_reviewer'
    ? statusOptions.filter(s => s.value === 'all' || s.value === 'pending_review')
    : statusOptions;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-2 text-gray-600">
            {canReview ? 'Review and approve website content' : 'Manage and review all website content'}
            {session?.user?.role === 'content_reviewer' && (
              <span className="ml-2 text-sm text-amber-600">(Showing pending review only)</span>
            )}
          </p>
        </div>
        {canEdit && (
          <ContentCreateModal
            trigger={
              <Button className="bg-amber-600">
                <FilePlus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            }
            onSuccess={fetchContent}
          />
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {contentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Content ({content.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created</TableHead>
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
              ) : content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">
                      {session?.user?.role === 'content_reviewer'
                        ? 'No pending content to review'
                        : 'No content found'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                content.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{getTypeLabel(item.type)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(item.status)}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.createdBy?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={`/admin/content/review/${item._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              {item.status === 'pending_review' ? 'Review' : 'View'}
                            </a>
                          </DropdownMenuItem>

                          {canEdit && item.status === 'draft' && (
                            <ContentEditModal
                              contentId={item._id}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
                              >
                                <Check className="mr-2 h-4 w-4" />
                                {actionLoading === item._id ? 'Approving...' : 'Approve'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleReject(item._id)}
                                disabled={actionLoading === item._id}
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                {actionLoading === item._id ? 'Rejecting...' : 'Reject'}
                              </DropdownMenuItem>
                            </>
                          )}

                          {canDelete && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(item._id)}
                              disabled={actionLoading === item._id}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {actionLoading === item._id ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                          )}
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
