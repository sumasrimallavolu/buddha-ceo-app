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
import { BookOpen, MoreVertical, Edit, Trash, Download } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
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

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'book':
        return 'bg-emerald-100 text-emerald-800';
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'magazine':
        return 'bg-green-100 text-green-800';
      case 'link':
        return 'bg-amber-100 text-stone-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'content_manager';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="mt-2 text-gray-600">
            Manage books, videos, magazines, and links
          </p>
        </div>
        {canEdit && (
          <ResourceCreateModal
            trigger={
              <Button className="bg-amber-600">
                <BookOpen className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            }
            onSuccess={fetchResources}
          />
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Resources ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">Loading...</p>
                  </TableCell>
                </TableRow>
              ) : resources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">No resources found</p>
                  </TableCell>
                </TableRow>
              ) : (
                resources.map((resource) => (
                  <TableRow key={resource._id}>
                    <TableCell className="font-medium">{resource.title}</TableCell>
                    <TableCell>
                      <Badge className={getTypeBadgeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{resource.category}</TableCell>
                    <TableCell>{resource.order}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canEdit && (
                            <ResourceEditModal
                              resourceId={resource._id}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              }
                              onSuccess={fetchResources}
                            />
                          )}
                          {(resource.type === 'book' || resource.type === 'magazine') && (
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                          )}
                          {canEdit && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(resource._id)}
                              disabled={deleting === resource._id}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              {deleting === resource._id ? 'Deleting...' : 'Delete'}
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
