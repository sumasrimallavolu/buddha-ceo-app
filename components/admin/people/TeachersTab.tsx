'use client';

import { useEffect, useState } from 'react';
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
import { MoreVertical, Users, Clock, CheckCircle, XCircle, Mail, GraduationCap } from 'lucide-react';

interface TeacherApplication {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  profession: string;
  meditationExperience: string;
  teachingExperience?: string;
  status: string;
  createdAt: string;
}

interface TeachersTabProps {
  canEdit: boolean;
}

export function TeachersTab({ canEdit }: TeachersTabProps) {
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/teacher-applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (error) {
      setError('An error occurred while fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const response = await fetch('/api/admin/teacher-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setApplications(applications.map((app) =>
          app._id === id ? { ...app, status } : app
        ));
      } else {
        setError('Failed to update application');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    setActionLoading(id);
    try {
      const response = await fetch(`/api/admin/teacher-applications?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApplications(applications.filter((app) => app._id !== id));
      } else {
        setError('Failed to delete application');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
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
          icon: Clock,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white">
          Teacher Applications ({applications.length})
        </h2>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Applications Table */}
      <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableHead className="text-slate-400 font-medium">Name</TableHead>
                <TableHead className="text-slate-400 font-medium">Email</TableHead>
                <TableHead className="text-slate-400 font-medium">Phone</TableHead>
                <TableHead className="text-slate-400 font-medium">Location</TableHead>
                <TableHead className="text-slate-400 font-medium">Profession</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium">Applied</TableHead>
                {canEdit && (
                  <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canEdit ? 8 : 7} className="text-center py-12">
                    <GraduationCap className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">No teacher applications found</p>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => {
                  const statusBadge = getStatusBadge(application.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <TableRow key={application._id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        {application.firstName} {application.lastName}
                      </TableCell>
                      <TableCell className="text-slate-400">{application.email}</TableCell>
                      <TableCell className="text-slate-400">{application.phone}</TableCell>
                      <TableCell className="text-slate-400">
                        {application.city}, {application.state}, {application.country}
                      </TableCell>
                      <TableCell className="text-slate-400">{application.profession}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                              {application.status === 'pending' && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(application._id, 'approved')}
                                    disabled={actionLoading === application._id}
                                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 focus:bg-emerald-500/10"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(application._id, 'contacted')}
                                    disabled={actionLoading === application._id}
                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 focus:bg-blue-500/10"
                                  >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Mark as Contacted
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateStatus(application._id, 'rejected')}
                                    disabled={actionLoading === application._id}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleDelete(application._id)}
                                disabled={actionLoading === application._id}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10"
                              >
                                {actionLoading === application._id ? 'Deleting...' : 'Delete'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
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
