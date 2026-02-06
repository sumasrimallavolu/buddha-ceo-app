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
import { BookOpen, MoreVertical, Edit, Trash, Download, Book, Video, FileText, Link } from 'lucide-react';
import { ResourceCreateModal, ResourceEditModal } from '@/components/admin';

interface Resource {
  _id: string;
  title: string;
  type: string;
  category: string;
  description: string;
  order: number;
}

export default function ResourcesPage() {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      } else {
        setError('Failed to fetch resources');
      }
    } catch (error) {
      setError('An error occurred while fetching resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    setDeleting(resourceId);
    try {
      const response = await fetch(`/api/admin/resources/${resourceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResources(resources.filter((r) => r._id !== resourceId));
      } else {
        setError('Failed to delete resource');
      }
    } catch (error) {
      setError('An error occurred while deleting resource');
    } finally {
      setDeleting(null);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'book':
        return {
          label: 'Book',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: Book,
        };
      case 'video':
        return {
          label: 'Video',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: Video,
        };
      case 'magazine':
        return {
          label: 'Magazine',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: FileText,
        };
      case 'link':
        return {
          label: 'Link',
          className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          icon: Link,
        };
      default:
        return {
          label: type,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: BookOpen,
        };
    }
  };

  const canEdit = session?.user?.role === 'content_manager';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resource Management</h1>
          <p className="text-slate-400">
            Manage books, videos, magazines, and links
          </p>
        </div>
        {canEdit && (
          <ResourceCreateModal
            trigger={
              <Button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
                <BookOpen className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            }
            onSuccess={fetchResources}
          />
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Resources Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            All Resources ({resources.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-400 font-medium">Title</TableHead>
                <TableHead className="text-slate-400 font-medium">Type</TableHead>
                <TableHead className="text-slate-400 font-medium">Category</TableHead>
                <TableHead className="text-slate-400 font-medium">Order</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </TableCell>
                </TableRow>
              ) : resources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No resources found</p>
                  </TableCell>
                </TableRow>
              ) : (
                resources.map((resource) => {
                  const typeBadge = getTypeBadge(resource.type);
                  const TypeIcon = typeBadge.icon;

                  return (
                    <TableRow key={resource._id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{resource.title}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${typeBadge.className}`}>
                          <TypeIcon className="h-3 w-3" />
                          {typeBadge.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">{resource.category}</TableCell>
                      <TableCell className="text-slate-400">{resource.order}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                            {canEdit && (
                              <ResourceEditModal
                                resourceId={resource._id}
                                trigger={
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                }
                                onSuccess={fetchResources}
                              />
                            )}

                            {(resource.type === 'book' || resource.type === 'magazine') && (
                              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                            )}

                            {canEdit && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(resource._id)}
                                disabled={deleting === resource._id}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {deleting === resource._id ? 'Deleting...' : 'Delete'}
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
