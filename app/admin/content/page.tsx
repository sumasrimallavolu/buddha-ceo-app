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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Edit, Trash, Loader2, Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Content {
  _id: string;
  title: string;
  type: 'photos' | 'mentors' | 'founders' | 'steering_committee';
  status: 'draft' | 'pending_review' | 'published' | 'archived';
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const contentTypes = ['all', 'photos', 'mentors', 'founders', 'steering_committee'];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export default function ContentPage() {
  const { data: session, status } = useSession();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Only content_manager can add content
  const canAddContent = session?.user?.role === 'content_manager';

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login';
      return;
    }

    if (status === 'authenticated') {
      fetchContent();
    }
  }, [status, typeFilter, statusFilter]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/content${params.toString() ? '?' + params.toString() : ''}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const response = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setContent(content.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      photos: 'Photos',
      mentors: 'Mentors',
      founders: 'Founders & Trustees',
      steering_committee: 'Steering Committee',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || '';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-slate-400">Manage photos, mentors, founders & trustees, and steering committee</p>
        </div>
        {canAddContent && (
          <Link href="/admin/content/new">
            <Button className="bg-blue-600 text-white rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-slate-400" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              {contentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Types' : getTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-white">Title</TableHead>
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Created By</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                    No content found
                  </TableCell>
                </TableRow>
              ) : (
                content.map((item) => (
                  <TableRow key={item._id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-white/20 text-white">
                        {getTypeLabel(item.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === 'pending_review' ? 'Pending Review' :
                         item.status === 'draft' ? 'Draft' :
                         item.status === 'published' ? 'Published' : 'Archived'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {item.createdBy?.name || item.createdBy?.email || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                          <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                            <Link href={`/admin/content/edit/${item._id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item._id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
