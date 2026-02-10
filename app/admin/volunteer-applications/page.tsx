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
import { Badge } from '@/components/ui/badge';
import { MoreVertical, CheckCircle, XCircle, Mail, Phone, RefreshCw, Users, FileText, Clock } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface VolunteerOpportunity {
  _id: string;
  title: string;
}

interface VolunteerApplication {
  _id: string;
  opportunityId: string;
  name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  createdAt: string;
  customAnswers?: Record<string, string>;
}

export default function VolunteerApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const canManage = session?.user?.role === 'admin' ||
                   session?.user?.role === 'content_manager' ||
                   session?.user?.role === 'content_reviewer';
  const canDelete = session?.user?.role === 'admin';

  useEffect(() => {
    fetchOpportunities();
    fetchApplications();
  }, [selectedOpportunity, selectedStatus]);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/admin/volunteer-opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedOpportunity !== 'all') {
        params.append('opportunityId', selectedOpportunity);
      }
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus);
      }

      const response = await fetch(`/api/admin/volunteer-applications?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch applications');
      }

      setApplications(data.applications || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected' | 'contacted') => {
    setActionLoading(applicationId);
    try {
      const response = await fetch(`/api/admin/volunteer-applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      setApplications(applications.map(app =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    setActionLoading(applicationId);
    try {
      const response = await fetch(`/api/admin/volunteer-applications/${applicationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete application');
      }

      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete application');
    } finally {
      setActionLoading(null);
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
      case 'contacted':
        return {
          label: 'Contacted',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: Mail,
        };
      default:
        return {
          label: status,
          className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
          icon: FileText,
        };
    }
  };

  const getOpportunityTitle = (opportunityId: string) => {
    const opportunity = opportunities.find(op => op._id === opportunityId);
    return opportunity?.title || 'Unknown Opportunity';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Volunteer Applications</h1>
          <p className="text-slate-400">
            Manage volunteer applications and their status
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchApplications}
          disabled={loading}
          className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-white">{applications.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">
                {applications.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Approved</p>
              <p className="text-3xl font-bold text-emerald-400">
                {applications.filter(a => a.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-400">
                {applications.filter(a => a.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select value={selectedOpportunity} onValueChange={setSelectedOpportunity}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by opportunity" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="all">All Opportunities</SelectItem>
              {opportunities.map((opportunity) => (
                <SelectItem key={opportunity._id} value={opportunity._id}>
                  {opportunity.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5 bg-white/5">
                <TableHead className="text-slate-400 font-medium">Name</TableHead>
                <TableHead className="text-slate-400 font-medium">Opportunity</TableHead>
                <TableHead className="text-slate-400 font-medium">Contact</TableHead>
                <TableHead className="text-slate-400 font-medium">Applied Date</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <FileText className="h-16 w-16 text-slate-600 mb-4" />
                      <p className="text-slate-400 text-lg">No applications found</p>
                      <p className="text-slate-500 text-sm mt-2">
                        {selectedOpportunity !== 'all' || selectedStatus !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Applications will appear here when volunteers apply'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => {
                  const statusBadge = getStatusBadge(application.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <TableRow key={application._id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{application.name}</TableCell>
                      <TableCell>
                        <span className="text-slate-300 text-sm">{getOpportunityTitle(application.opportunityId)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-slate-400" />
                            <span className="text-slate-300">{application.email}</span>
                          </div>
                          {application.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-slate-400" />
                              <span className="text-slate-300">{application.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-300">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusBadge.className} border-0 capitalize`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-white hover:bg-white/10"
                              disabled={actionLoading === application._id}
                            >
                              {actionLoading === application._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreVertical className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                            {canManage && application.status === 'pending' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(application._id, 'approved')}
                                  className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 focus:bg-emerald-500/10"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}

                            {canManage && application.status === 'approved' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(application._id, 'contacted')}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 focus:bg-blue-500/10"
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Mark as Contacted
                              </DropdownMenuItem>
                            )}

                            {canDelete && (
                              <DropdownMenuItem
                                onClick={() => handleDelete(application._id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Delete
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
