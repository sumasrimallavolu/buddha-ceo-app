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
import { Plus, MoreVertical, Edit, Trash, Users, Calendar, MapPin, Globe } from 'lucide-react';
import Link from 'next/link';

interface VolunteerOpportunity {
  _id: string;
  title: string;
  type: string;
  location: string;
  status: string;
  currentApplications: number;
  maxVolunteers: number;
  startDate: string;
  endDate: string;
}

export default function VolunteerOpportunitiesPage() {
  const { data: session } = useSession();
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchOpportunities();
  }, [filter]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const url = filter === 'all'
        ? '/api/admin/volunteer-opportunities'
        : `/api/admin/volunteer-opportunities?status=${filter}`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      } else {
        setError('Failed to fetch volunteer opportunities');
      }
    } catch (error) {
      setError('An error occurred while fetching volunteer opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (opportunityId: string) => {
    if (!confirm('Are you sure you want to delete this volunteer opportunity?')) {
      return;
    }

    setDeleting(opportunityId);
    try {
      const response = await fetch(`/api/admin/volunteer-opportunities/${opportunityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOpportunities(opportunities.filter((o) => o._id !== opportunityId));
      } else {
        setError('Failed to delete volunteer opportunity');
      }
    } catch (error) {
      setError('An error occurred while deleting volunteer opportunity');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return {
          label: 'Open',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
      case 'closed':
        return {
          label: 'Closed',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
      case 'draft':
        return {
          label: 'Draft',
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        };
      default:
        return {
          label: status,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
        };
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Remote':
        return {
          label: 'Remote',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: Globe,
        };
      case 'On-site':
        return {
          label: 'On-site',
          className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
          icon: MapPin,
        };
      case 'Hybrid':
        return {
          label: 'Hybrid',
          className: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
          icon: MapPin,
        };
      default:
        return {
          label: type,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: Globe,
        };
    }
  };

  const canEdit = session?.user?.role === 'content_manager' || session?.user?.role === 'admin';
  const canDelete = session?.user?.role === 'admin';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Volunteer Opportunities</h1>
          <p className="text-slate-400">
            Manage volunteer opportunities and applications
          </p>
        </div>
        {canEdit && (
          <Link href="/admin/volunteer-opportunities/new">
            <Button className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
              <Plus className="mr-2 h-4 w-4" />
              Add Opportunity
            </Button>
          </Link>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Opportunities Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">
              All Opportunities ({opportunities.length})
            </h2>
            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Filter by status:</span>
              <div className="flex gap-1">
                {(['all', 'open', 'closed', 'draft'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      filter === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-400 font-medium">Title</TableHead>
                <TableHead className="text-slate-400 font-medium">Type</TableHead>
                <TableHead className="text-slate-400 font-medium">Location</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium">Applications</TableHead>
                <TableHead className="text-slate-400 font-medium">Dates</TableHead>
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
              ) : opportunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No volunteer opportunities found</p>
                    {filter !== 'all' && (
                      <p className="text-slate-500 text-sm mt-1">Try changing the filter</p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                opportunities.map((opportunity) => {
                  const statusBadge = getStatusBadge(opportunity.status);
                  const typeBadge = getTypeBadge(opportunity.type);
                  const TypeIcon = typeBadge.icon;

                  return (
                    <TableRow key={opportunity._id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{opportunity.title}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${typeBadge.className}`}>
                          <TypeIcon className="h-3 w-3" />
                          {typeBadge.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">{opportunity.location}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                          {statusBadge.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {opportunity.currentApplications}
                          {opportunity.maxVolunteers && ` / ${opportunity.maxVolunteers}`}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(opportunity.startDate).toLocaleDateString()} - {' '}
                          {new Date(opportunity.endDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                            {canEdit && (
                              <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-white/10 focus:bg-white/10">
                                <Link href={`/admin/volunteer-opportunities/${opportunity._id}/edit`} className="flex items-center w-full">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                            )}

                            {canDelete && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(opportunity._id)}
                                disabled={deleting === opportunity._id}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                {deleting === opportunity._id ? 'Deleting...' : 'Delete'}
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
