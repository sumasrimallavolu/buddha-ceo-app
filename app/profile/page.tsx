'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  MapPin,
  User,
  Briefcase,
  AlertCircle,
  Loader2,
  FileText,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { VolunteerApplication } from '@/types/volunteer';
import { formatDistanceToNow } from 'date-fns';

const statusConfig = {
  pending: {
    label: 'Pending Review',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: Clock
  },
  approved: {
    label: 'Approved',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle
  },
  rejected: {
    label: 'Not Selected',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: XCircle
  },
  contacted: {
    label: 'Contacted',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Mail
  }
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile');
      return;
    }

    if (status === 'authenticated') {
      fetchApplications();
    }
  }, [status, router]);

  const fetchApplications = async () => {
    try {
      console.log('Fetching applications...');
      const response = await fetch('/api/volunteer/my-applications');
      const data = await response.json();

      console.log('API Response:', data);

      if (response.ok) {
        setApplications(data.applications || []);
        console.log('Applications loaded:', data.applications?.length || 0);
      } else {
        console.error('API Error:', data.error);
        setError(data.error || 'Failed to fetch applications');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-3xl font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {session?.user?.name || 'User Profile'}
              </h1>
              <p className="text-slate-400 mt-1">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-400 text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{applications.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-400 text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {applications.filter(a => a.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-400 text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400">
                {applications.filter(a => a.status === 'approved' || a.status === 'contacted').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-400 text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">
                {applications.filter(a => a.status === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">My Volunteer Applications</h2>
            <Link href="/volunteer-opportunities">
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                <Heart className="mr-2 h-4 w-4" />
                Browse Opportunities
              </Button>
            </Link>
          </div>

          {applications.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-16 text-center">
                <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Applications Yet</h3>
                <p className="text-slate-400 mb-6">
                  You haven't applied to any volunteer opportunities yet.
                </p>
                <Link href="/volunteer-opportunities">
                  <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                    <Heart className="mr-2 h-4 w-4" />
                    Start Volunteering
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => {
                const statusInfo = statusConfig[application.status as keyof typeof statusConfig];
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={application._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-white/5 border-white/10 overflow-hidden">
                      <CardContent className="p-0">
                        {/* Opportunity Header */}
                        <div className="p-6 border-b border-white/10">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-white mb-2">
                                {application.opportunity?.title || application.opportunityTitle}
                              </h3>
                              <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                                {application.opportunity && (
                                  <>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {application.opportunity.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Briefcase className="h-4 w-4" />
                                      {application.opportunity.type}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {application.opportunity.timeCommitment}
                                    </span>
                                  </>
                                )}
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                            <Badge className={`gap-2 ${statusInfo.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>

                        {/* Application Details */}
                        <div className="p-6">
                          <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide">
                            Your Application Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500">Name</p>
                              <p className="text-white font-medium">
                                {application.firstName} {application.lastName}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Email</p>
                              <p className="text-white font-medium">{application.email}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Phone</p>
                              <p className="text-white font-medium">{application.phone}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Location</p>
                              <p className="text-white font-medium">
                                {application.city}, {application.state}, {application.country}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Profession</p>
                              <p className="text-white font-medium">{application.profession}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Age</p>
                              <p className="text-white font-medium">{application.age} years old</p>
                            </div>
                          </div>

                          {/* Experience & Skills */}
                          <div className="mt-4 space-y-3">
                            <div>
                              <p className="text-slate-500 text-sm mb-1">Relevant Experience</p>
                              <p className="text-white text-sm bg-white/5 p-3 rounded-lg">
                                {application.experience}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-sm mb-1">Skills & Talents</p>
                              <p className="text-white text-sm bg-white/5 p-3 rounded-lg">
                                {application.skills}
                              </p>
                            </div>
                          </div>

                          {/* Status History */}
                          {application.statusHistory && application.statusHistory.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                              <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                                Application History
                              </h4>
                              <div className="space-y-2">
                                {application.statusHistory.map((history, index) => {
                                  const historyStatusInfo = statusConfig[history.status as keyof typeof statusConfig];
                                  const HistoryStatusIcon = historyStatusInfo.icon;
                                  return (
                                    <div key={index} className="flex items-center gap-3 text-sm">
                                      <div className={`p-1.5 rounded-lg ${historyStatusInfo.color}`}>
                                        <HistoryStatusIcon className="h-3 w-3" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-white font-medium">{historyStatusInfo.label}</p>
                                        <p className="text-slate-500 text-xs">
                                          {formatDistanceToNow(new Date(history.changedAt), { addSuffix: true })}
                                          {history.changedBy && ` • by ${history.changedBy}`}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
